import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Email, Password, User, USER_REPOSITORY_PORT, UserRepositoryPort, PASSWORD_HASHER_PORT, PasswordHasherPort } from '../../../domain';
import { CreateUserCommand } from './create-user.command';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { ConflictException } from '@app/common';
import { UserResponseMapper } from '../../mappers/user-response.mapper';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserResponseDto> {
    const email = Email.create(command.email);
    const password = Password.create(command.password);
    
    const existingUser = await this.userRepository.findByEmail(email.value);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await this.passwordHasher.hash(password.value);
    
    const user = User.create(email, passwordHash);
    
    await this.userRepository.save(user);

    return UserResponseMapper.toDto(user);
  }
}
