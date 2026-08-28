export class IdentityUserDto {
  id!: string;
  email!: string;
  role!: string;
  isActive!: boolean;
  createdAt!: string;
}

export interface CreateUserDto {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}
