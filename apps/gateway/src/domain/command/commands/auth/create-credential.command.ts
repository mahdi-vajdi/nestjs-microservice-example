export class CreateCredentialCommandRequest {
  userId: string;
  password: string;
}

export class CreateCredentialCommandResponse {
  createdAt: Date;
}
