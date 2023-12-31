export interface Tokens {
  id?: string;
  user_id: string;
  refresh_token: string;
  code: string;
  expires_date: Date;
  created_at: Date;
  updated_at?: Date;
}
