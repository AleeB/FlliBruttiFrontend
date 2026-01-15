export type UserRole = 'dipendente' | 'cliente' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isDeleted?: boolean; // soft delete flag
}


