import 'dotenv/config';

import { AppDataSource } from '@app/infrastructure';
import { DataSource } from 'typeorm';

export const UserDataSource = new DataSource({
  ...AppDataSource.options,
  entities: ['dist/apps/user-service/**/*.entity{.ts,.js}'],
  migrations: ['dist/apps/user-service/**/migrations/**/*.js'],
});
