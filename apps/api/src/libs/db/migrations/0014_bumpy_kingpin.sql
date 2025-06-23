ALTER TABLE "users_to_boards" ALTER COLUMN "role" DROP DEFAULT;
-- Update all sole members of boards to have 'admin' role
UPDATE users_to_boards 
SET role = 'admin' 
WHERE (board_id, user_id) IN (
  SELECT board_id, user_id
  FROM (
    SELECT 
      board_id, 
      user_id, 
      COUNT(*) OVER (PARTITION BY board_id) as member_count
    FROM users_to_boards
  ) subquery
  WHERE member_count = 1 AND role = 'member'
);