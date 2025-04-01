export interface GetUserIdsRequest {
  accountId: string;
}

export interface GetUserIdsResponse {
  userIds: string[] | undefined;
}
