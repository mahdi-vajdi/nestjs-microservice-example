export class User {
  id: string;
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }

  static create(
    email: string,
    phone: string,
    firstName: string,
    lastName: string,
    avatar: string,
  ): User {
    return new User({
      email: email,
      mobile: phone,
      firstName: firstName,
      lastName: lastName,
      avatar: avatar,
    });
  }
}
