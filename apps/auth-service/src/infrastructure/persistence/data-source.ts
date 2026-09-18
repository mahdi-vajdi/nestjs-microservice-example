import 'dotenv/config';

import { AppDataSource } from '@app/infrastructure';
import { DataSource } from 'typeorm';

export const AuthDataSource = new DataSource({
  ...AppDataSource.options,
  entities: ['dist/apps/auth-service/**/*.entity{.ts,.js}'],
  migrations: ['dist/apps/auth-service/**/migrations/**/*.js'],
});
