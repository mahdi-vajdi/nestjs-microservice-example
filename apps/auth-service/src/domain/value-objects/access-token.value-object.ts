import { InvalidInputException, ValueObject } from '@app/common';

interface AccessTokenProps {
  value: string;
}

export class AccessToken extends ValueObject<AccessTokenProps> {
  private constructor(props: AccessTokenProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(value: string): AccessToken {
    return new AccessToken({ value });
  }

  protected validate(props: AccessTokenProps): void {
    if (!props.value || props.value.trim().length === 0) {
      throw new InvalidInputException('AccessToken value cannot be empty');
    }
  }
}
