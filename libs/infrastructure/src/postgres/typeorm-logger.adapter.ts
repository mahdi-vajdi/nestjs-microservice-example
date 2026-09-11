import { Logger as NestLogger } from '@nestjs/common';
import { Logger as TypeOrmLogger } from 'typeorm';

export class TypeOrmLoggerAdapter implements TypeOrmLogger {
  private readonly logger = new NestLogger('TypeORM');

  logQuery(query: string, parameters?: unknown[]) {
    this.logger.debug(JSON.stringify({ query, parameters }), 'Database query executed');
  }

  logQueryError(error: string | Error, query: string, parameters?: unknown[]) {
    this.logger.error(JSON.stringify({ error, query, parameters }), 'Database query failed');
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    this.logger.warn(
      JSON.stringify({ time, query, parameters }),
      `Slow database query (${time}ms)`,
    );
  }

  logSchemaBuild(message: string) {
    this.logger.log(message);
  }

  logMigration(message: string) {
    this.logger.log(message);
  }

  log(level: 'log' | 'info' | 'warn', message: unknown) {
    if (level === 'log' || level === 'info') {
      this.logger.log(message);
    } else if (level === 'warn') {
      this.logger.warn(message);
    }
  }
}
