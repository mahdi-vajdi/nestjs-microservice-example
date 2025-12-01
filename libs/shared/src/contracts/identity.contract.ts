export const IDENTITY_PATTERNS = {
  // Commands
  CREATE_USER: { cmd: 'create_user' },

  // Queries
  GET_USER: { cmd: 'get_user' },
} as const;

// DTOs
export class IdentityUserDto {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserDto {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}
