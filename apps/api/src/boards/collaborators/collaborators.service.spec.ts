import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { UsersService } from '../../auth/users/users.service';
import { UsersToBoards } from '../../libs/db/schema';
import { User } from '../../auth/auth-service.types';
import { DATABASE_TOKEN } from '../../db/db.module';

describe('CollaboratorsService', () => {
  let service: CollaboratorsService;
  let mockDb: any;
  let mockUsersService: jest.Mocked<UsersService>;
  let mockTransaction: any;

  const mockUser1: User = {
    id: 'user1',
    primary_email: 'user1@example.com',
    display_name: 'User One',
    primary_email_verified: true,
    primary_email_auth_enabled: true,
    signed_up_at_millis: Date.now(),
    last_active_at_millis: Date.now(),
    selected_team: null,
    selected_team_id: null,
    profile_image_url: '',
    client_metadata: null,
    client_read_only_metadata: null,
    server_metadata: null,
    has_password: false,
  };

  const mockUser2: User = {
    ...mockUser1,
    id: 'user2',
    primary_email: 'user2@example.com',
    display_name: 'User Two',
  };

  const mockUser3: User = {
    ...mockUser1,
    id: 'user3',
    primary_email: 'user3@example.com',
    display_name: 'User Three',
  };

  beforeEach(async () => {
    // Mock transaction methods
    mockTransaction = {
      select: jest.fn(),
      from: jest.fn(),
      where: jest.fn(),
      delete: jest.fn(),
      insert: jest.fn(),
      values: jest.fn(),
      update: jest.fn(),
      set: jest.fn(),
    };

    // Make all methods return the transaction object for chaining
    mockTransaction.select.mockReturnValue(mockTransaction);
    mockTransaction.from.mockReturnValue(mockTransaction);
    mockTransaction.where.mockReturnValue(mockTransaction);
    mockTransaction.delete.mockReturnValue(mockTransaction);
    mockTransaction.insert.mockReturnValue(mockTransaction);
    mockTransaction.values.mockReturnValue(mockTransaction);
    mockTransaction.update.mockReturnValue(mockTransaction);
    mockTransaction.set.mockReturnValue(mockTransaction);

    // Mock database
    mockDb = {
      transaction: jest
        .fn()
        .mockImplementation((callback) => callback(mockTransaction)),
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      returning: jest.fn(),
      delete: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
    };

    // Mock UsersService
    mockUsersService = {
      get: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      getBoardsOfUser: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollaboratorsService,
        {
          provide: DATABASE_TOKEN,
          useValue: mockDb,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<CollaboratorsService>(CollaboratorsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('bulkUpdate', () => {
    const boardId = 123;

    it('should handle insertions, updates, and deletions correctly', async () => {
      // Arrange
      const currentCollaborators: UsersToBoards[] = [
        {
          userId: 'user1',
          boardId,
          role: 'collaborator', // Will be updated to admin
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 'user2',
          boardId,
          role: 'admin', // Will be deleted (not in new list)
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const newCollaborators = [
        { userId: 'user1', role: 'admin' as const }, // Update existing
        { userId: 'user3', role: 'collaborator' as const }, // Insert new
        // user2 is deleted (not in new list)
      ];

      const finalCollaborators: UsersToBoards[] = [
        {
          userId: 'user1',
          boardId,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 'user3',
          boardId,
          role: 'collaborator',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Mock database responses - track call sequence properly
      let isSelectOperation = false;
      let selectCallCount = 0;

      mockTransaction.select.mockImplementation(() => {
        isSelectOperation = true;
        return mockTransaction;
      });

      mockTransaction.where.mockImplementation(() => {
        if (isSelectOperation) {
          selectCallCount++;
          isSelectOperation = false; // Reset flag
          if (selectCallCount === 1) {
            return Promise.resolve(currentCollaborators);
          } else if (selectCallCount === 2) {
            return Promise.resolve(finalCollaborators);
          }
        }
        return Promise.resolve(undefined); // For delete/update operations
      });

      // Mock user service responses
      mockUsersService.get
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(mockUser3);

      // Act
      const result = await service.bulkUpdate(boardId, newCollaborators);

      // Assert - Verify database operations
      expect(mockDb.transaction).toHaveBeenCalledTimes(1);

      // Should call where for: initial select, delete, update, final select
      expect(mockTransaction.where).toHaveBeenCalledTimes(4);

      // Should delete user2 (removed collaborator)
      expect(mockTransaction.delete).toHaveBeenCalledTimes(1);

      // Should insert user3 (new collaborator)
      expect(mockTransaction.insert).toHaveBeenCalledTimes(1);
      expect(mockTransaction.values).toHaveBeenCalledWith([
        {
          boardId,
          userId: 'user3',
          role: 'collaborator',
        },
      ]);

      // Should update user1's role
      expect(mockTransaction.update).toHaveBeenCalledTimes(1);
      expect(mockTransaction.set).toHaveBeenCalledWith({ role: 'admin' });

      // Should fetch user data for final collaborators
      expect(mockUsersService.get).toHaveBeenCalledTimes(2);
      expect(mockUsersService.get).toHaveBeenCalledWith('user1');
      expect(mockUsersService.get).toHaveBeenCalledWith('user3');

      // Verify result
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        ...finalCollaborators[0],
        user: mockUser1,
      });
      expect(result[1]).toEqual({
        ...finalCollaborators[1],
        user: mockUser3,
      });
    });

    it('should handle only insertions', async () => {
      // Arrange - No existing collaborators
      const currentCollaborators: UsersToBoards[] = [];
      const newCollaborators: {
        userId: string;
        role: 'admin' | 'collaborator';
      }[] = [
        { userId: 'user1', role: 'admin' as const },
        { userId: 'user2', role: 'collaborator' as const },
      ];

      const finalCollaborators: UsersToBoards[] = [
        {
          userId: 'user1',
          boardId,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 'user2',
          boardId,
          role: 'collaborator',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockTransaction.where.mockResolvedValueOnce(currentCollaborators);
      mockTransaction.where.mockResolvedValueOnce(finalCollaborators);
      mockUsersService.get
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(mockUser2);

      // Act
      const result = await service.bulkUpdate(boardId, newCollaborators);

      // Assert
      expect(mockTransaction.delete).not.toHaveBeenCalled(); // No deletions
      expect(mockTransaction.update).not.toHaveBeenCalled(); // No updates
      expect(mockTransaction.insert).toHaveBeenCalledTimes(1); // Only insertions
      expect(mockTransaction.values).toHaveBeenCalledWith([
        { boardId, userId: 'user1', role: 'admin' },
        { boardId, userId: 'user2', role: 'collaborator' },
      ]);
      expect(result).toHaveLength(2);
    });

    it('should handle only deletions', async () => {
      // Arrange - Remove all collaborators
      const currentCollaborators: UsersToBoards[] = [
        {
          userId: 'user1',
          boardId,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const newCollaborators: {
        userId: string;
        role: 'admin' | 'collaborator';
      }[] = []; // Remove all

      // Mock database responses - track call sequence properly
      let isSelectOperation = false;
      let selectCallCount = 0;

      mockTransaction.select.mockImplementation(() => {
        isSelectOperation = true;
        return mockTransaction;
      });

      mockTransaction.where.mockImplementation(() => {
        if (isSelectOperation) {
          selectCallCount++;
          isSelectOperation = false; // Reset flag
          if (selectCallCount === 1) {
            return Promise.resolve(currentCollaborators);
          } else if (selectCallCount === 2) {
            return Promise.resolve([]); // No final collaborators
          }
        }
        return Promise.resolve(undefined); // For delete/update operations
      });

      // Act
      const result = await service.bulkUpdate(boardId, newCollaborators);

      // Assert
      expect(mockTransaction.delete).toHaveBeenCalledTimes(1); // Only deletions
      expect(mockTransaction.insert).not.toHaveBeenCalled(); // No insertions
      expect(mockTransaction.update).not.toHaveBeenCalled(); // No updates
      expect(mockUsersService.get).not.toHaveBeenCalled(); // No users to fetch
      expect(result).toHaveLength(0);
    });

    it('should handle only role updates', async () => {
      // Arrange - Same users, different roles
      const currentCollaborators: UsersToBoards[] = [
        {
          userId: 'user1',
          boardId,
          role: 'collaborator',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 'user2',
          boardId,
          role: 'collaborator',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const newCollaborators = [
        { userId: 'user1', role: 'admin' as const }, // Update role
        { userId: 'user2', role: 'admin' as const }, // Update role
      ];

      const finalCollaborators: UsersToBoards[] = [
        {
          userId: 'user1',
          boardId,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 'user2',
          boardId,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Mock database responses - track call sequence properly
      let isSelectOperation = false;
      let selectCallCount = 0;

      mockTransaction.select.mockImplementation(() => {
        isSelectOperation = true;
        return mockTransaction;
      });

      mockTransaction.where.mockImplementation(() => {
        if (isSelectOperation) {
          selectCallCount++;
          isSelectOperation = false; // Reset flag
          if (selectCallCount === 1) {
            return Promise.resolve(currentCollaborators);
          } else if (selectCallCount === 2) {
            return Promise.resolve(finalCollaborators);
          }
        }
        return Promise.resolve(undefined); // For delete/update operations
      });

      mockUsersService.get
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(mockUser2);

      // Act
      const result = await service.bulkUpdate(boardId, newCollaborators);

      // Assert
      expect(mockTransaction.delete).not.toHaveBeenCalled(); // No deletions
      expect(mockTransaction.insert).not.toHaveBeenCalled(); // No insertions
      expect(mockTransaction.update).toHaveBeenCalledTimes(2); // Two updates
      expect(result).toHaveLength(2);
    });

    it('should handle no changes', async () => {
      // Arrange - Same collaborators with same roles
      const currentCollaborators: UsersToBoards[] = [
        {
          userId: 'user1',
          boardId,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const newCollaborators = [
        { userId: 'user1', role: 'admin' as const }, // No change
      ];

      mockTransaction.where.mockResolvedValueOnce(currentCollaborators);
      mockTransaction.where.mockResolvedValueOnce(currentCollaborators);
      mockUsersService.get.mockResolvedValueOnce(mockUser1);

      // Act
      const result = await service.bulkUpdate(boardId, newCollaborators);

      // Assert - No operations should be performed
      expect(mockTransaction.delete).not.toHaveBeenCalled();
      expect(mockTransaction.insert).not.toHaveBeenCalled();
      expect(mockTransaction.update).not.toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it('should handle database transaction correctly', async () => {
      // Arrange
      const newCollaborators = [{ userId: 'user1', role: 'admin' as const }];

      mockTransaction.where.mockResolvedValue([]);
      mockUsersService.get.mockResolvedValue(mockUser1);

      // Act
      await service.bulkUpdate(boardId, newCollaborators);

      // Assert
      expect(mockDb.transaction).toHaveBeenCalledTimes(1);
      expect(typeof mockDb.transaction.mock.calls[0][0]).toBe('function');
    });
  });
});
