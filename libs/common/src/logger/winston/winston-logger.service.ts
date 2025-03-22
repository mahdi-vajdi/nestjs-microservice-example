import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';

@Injectable()
export class WinstonLoggerService implements LoggerService, TypeOrmLogger {
  private epoch = 0;
  private preTimestamp = 0;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
  }

  /*
    Implementing methods for nestjs logger service
   */
  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug(
      {
        message: message,
        epoch: this.getEpoch(),
      },
      optionalParams,
    );
  }

  verbose(message: any, ...optionalParams: any[]): any {
    this.logger.verbose(
      {
        message: message,
        epoch: this.getEpoch(),
      },
      optionalParams,
    );
  }

  log(message: any, ...optionalParams: any[]): any {
    this.logger.log(
      {
        message: message,
        epoch: this.getEpoch(),
      },
      optionalParams,
    );
  }

  warn(message: any, ...optionalParams: any[]): any {
    this.logger.warn(
      {
        message: message,
        epoch: this.getEpoch(),
      },
      optionalParams,
    );
  }

  error(message: any, ...optionalParams: any[]): any {
    this.logger.error(
      {
        message: message,
        epoch: this.getEpoch(),
      },
      optionalParams[0],
      [optionalParams[1]],
    );
  }

  fatal?(message: any, ...optionalParams: any[]) {
    this.logger.fatal(
      {
        message: message,
        epoch: this.getEpoch(),
      },
      optionalParams,
    );
  }

  /*
    Implementing methods for typeorm logger service
   */
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.debug(
      {
        message: `[Query]: ${query}; [Parameters]: [${[parameters]}]`,
        epoch: this.getEpoch(),
      },
      ['Database'],
    );
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.error(
      {
        message: `[Error]: error ${error}. [Query]: ${query}; [Parameters]: [${[
          parameters,
        ]}]`,
        epoch: this.getEpoch(),
      },
      ['Database'],
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.warn(
      {
        message: `[Slow Query (${time} ms)]: ${query}; [Parameters]: [${[
          parameters,
        ]}]`,
        epoch: this.getEpoch(),
      },
      ['Database'],
    );
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.log(
      {
        message: `[Schema Build]: ${message}`,
        epoch: this.getEpoch(),
      },
      ['Database'],
    );
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.log(
      {
        message: `[Migration]: ${message}`,
        epoch: this.getEpoch(),
      },
      ['Database'],
    );
  }

  // This method is for getting a unified timestamp for logs
  private getEpoch(): string {
    const now = Date.now();
    if (now === this.preTimestamp) {
      this.epoch++;
    } else {
      this.epoch = 0;
    }
    this.preTimestamp = now;

    return `${this.preTimestamp}${this.epoch.toString().padStart(3, '0')}`;
  }
}
