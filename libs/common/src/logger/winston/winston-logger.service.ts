import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private epoch = 0;
  private preTimestamp = 0;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
  }

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
