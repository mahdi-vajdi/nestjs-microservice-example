export interface CreateProjectDto {
  ownerId: string;
  ownerTitle: string;
  private: boolean;
  title: string;
  description: string;
  picture: string;
}
