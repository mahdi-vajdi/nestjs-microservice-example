import { InvalidInputException, ValueObject } from '@app/common';

export interface UserIdProps {
  value: string;
}

export class UserId extends ValueObject<UserIdProps> {
  private constructor(props: UserIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(id: string): UserId {
    return new UserId({ value: id });
  }

  protected validate(props: UserIdProps): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(props.value)) {
      throw new InvalidInputException('Invalid user ID format. Must be a UUID.');
    }
  }
}
