export class CreateUserCommandRequest {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export class CreateUserCommandResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
