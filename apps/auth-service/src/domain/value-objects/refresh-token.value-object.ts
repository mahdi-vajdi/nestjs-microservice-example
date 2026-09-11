import { InvalidInputException, ValueObject } from '@app/common';

interface RefreshTokenProps {
  value: string;
}

export class RefreshToken extends ValueObject<RefreshTokenProps> {
  private constructor(props: RefreshTokenProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(value: string): RefreshToken {
    return new RefreshToken({ value });
  }

  protected validate(props: RefreshTokenProps): void {
    if (!props.value || props.value.trim().length === 0) {
      throw new InvalidInputException('RefreshToken value cannot be empty');
    }
  }
}
