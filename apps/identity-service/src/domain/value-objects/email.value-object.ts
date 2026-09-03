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

  static create(rawEmail: string): Email {
    const trimmed = rawEmail?.trim();
    return new Email({ value: trimmed });
  }

  protected validate(props: EmailProps): void {
    if (!props.value || typeof props.value !== 'string' || !Email.EMAIL_REGEX.test(props.value)) {
      throw new InvalidInputException(`Invalid email address: "${props.value}"`);
    }
  }
}
