export class CreateUserRequest {
  /**
   * The email address of the user.
   * @example 'user@example.com'
   */
  email: string;

  /**
   * The password of the user.
   * @example 'password123'
   */
  password: string;
}

export class CreateUserResponse {
  id: string;
}
