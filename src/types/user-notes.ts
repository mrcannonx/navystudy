export interface UserNote {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  title?: string;
  tags?: string[];
}

export interface CreateUserNoteParams {
  content: string;
  title?: string;
  tags?: string[];
}

export interface UpdateUserNoteParams {
  id: string;
  content?: string;
  title?: string;
  tags?: string[];
}

export interface UserNotesResponse {
  data: UserNote[] | null;
  error: Error | null;
}

export interface UserNoteResponse {
  data: UserNote | null;
  error: Error | null;
}