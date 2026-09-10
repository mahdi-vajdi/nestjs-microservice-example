import { InvalidInputException, ValueObject } from '@app/common';

interface PasswordProps {
  value: string;
}

export class Password extends ValueObject<PasswordProps> {
  public static readonly MIN_LENGTH = 8;
  public static readonly MAX_LENGTH = 32;

  private constructor(props: PasswordProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(rawPassword: string): Password {
    return new Password({ value: rawPassword });
  }

  protected validate(props: PasswordProps): void {
    if (
      !props.value ||
      typeof props.value !== 'string' ||
      props.value.length < Password.MIN_LENGTH ||
      props.value.length > Password.MAX_LENGTH
    ) {
      throw new InvalidInputException(
        `Password must be between ${Password.MIN_LENGTH} and ${Password.MAX_LENGTH} characters long.`,
      );
    }
  }
}
