export interface Team {
  created_at_millis: number;
  id: string;
  display_name: string;
  server_metadata: Record<string, any>;
  profile_image_url: string;
  client_metadata: Record<string, any>;
  client_read_only_metadata: Record<string, any>;
}

export interface ClientReadOnlyMetadata {
  lastAccessedBoardId?: number;
  settings?: {
    appearance?: 'dark' | 'light' | 'inherit';
  };
}

export interface User {
  id: string;
  primary_email_verified: boolean;
  primary_email_auth_enabled: boolean;
  signed_up_at_millis: number;
  last_active_at_millis: number;
  primary_email: string;
  display_name: string | null;
  selected_team: Team | null;
  selected_team_id: string | null;
  profile_image_url: string;
  client_metadata: Record<string, any> | null;
  client_read_only_metadata: ClientReadOnlyMetadata | null;
  server_metadata: Record<string, any> | null;
  has_password: boolean;
}

export interface ListUser extends User {
  is_anonymous: boolean;
}

export interface OtpSignInResponse {
  refresh_token: string;
  access_token: string;
  is_new_user: boolean;
  user_id: string;
}
