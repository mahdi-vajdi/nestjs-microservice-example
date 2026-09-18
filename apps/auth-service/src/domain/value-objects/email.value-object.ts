import { InvalidInputException, ValueObject } from '@app/common';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(props: EmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(raw: string): Email {
    return new Email({ value: raw?.trim() });
  }

  protected validate(props: EmailProps): void {
    if (!props.value || !Email.EMAIL_REGEX.test(props.value)) {
      throw new InvalidInputException(`Invalid email address: "${props.value}"`);
    }
  }
}
