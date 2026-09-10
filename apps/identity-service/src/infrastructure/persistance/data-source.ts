import 'dotenv/config';
import { DataSource } from 'typeorm';
import { AppDataSource } from '@app/infrastructure';

export const IdentityDataSource = new DataSource({
  ...AppDataSource.options,
  entities: ['dist/apps/identity-service/**/*.entity{.ts,.js}'],
  migrations: ['dist/apps/identity-service/**/migrations/**/*.js'],
});
