import 'dotenv/config';
import { DataSource } from 'typeorm';
import { AppDataSource } from '@app/infrastructure';

export const UserDataSource = new DataSource({
  ...AppDataSource.options,
  entities: ['dist/apps/user-service/**/*.entity{.ts,.js}'],
  migrations: ['dist/apps/user-service/**/migrations/**/*.js'],
});
