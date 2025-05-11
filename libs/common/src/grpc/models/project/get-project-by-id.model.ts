export class GetProjectByIdRequest {
  id: string;
}

export class GetProjectByIdResponse {
  title: string;
  description: string;
  private: boolean;
  ownerId: string;
  picture: string;
  createdAt: string;
  updatedAt: string;
}