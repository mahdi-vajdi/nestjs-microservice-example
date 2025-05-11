export class CreateProjectRequest {
  title: string;
  private: boolean;
  description: string;
  picture: string;
  ownerId: string;
  ownerTitle: string;
}

export class CreateProjectResponse {
  id: string;
  createdAt: string;
  ownerId: string;
}