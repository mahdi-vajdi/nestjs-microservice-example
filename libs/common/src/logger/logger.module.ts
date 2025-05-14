import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  WINSTON_LOGGER_CONFIG_TOKEN,
  WinstonLoggerConfig,
  winstonLoggerConfig,
} from './winston/config/winston-logger.config';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { WinstonLoggerService } from './winston/winston-logger.service';
import { LOGGER_PROVIDER } from './provider/logger.provider';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule.forFeature(winstonLoggerConfig)],
      useFactory: async (configService: ConfigService) => {
        const winstonConfig = configService.get<WinstonLoggerConfig>(
          WINSTON_LOGGER_CONFIG_TOKEN,
        );

        if (winstonConfig.useFile) {
          return {
            format: format.combine(
              format.timestamp(),
              format.ms(),
              format.json(),
            ),
            transports: [
              new transports.File({
                level: winstonConfig.level,
                filename: winstonConfig.filePath,
                maxFiles: 1,
                tailable: true,
              }),
              new transports.Console({
                level: winstonConfig.level,
              }),
            ],
          };
        }

        return {
          format: format.combine(
            format.ms(),
            format.timestamp(),
            format.colorize({
              all: true,
            }),
            format.simple(),
          ),
          transports: [
            new transports.Console({
              level: winstonConfig.level,
            }),
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: LOGGER_PROVIDER,
      useClass: WinstonLoggerService,
    },
  ],
  exports: [LOGGER_PROVIDER],
})
export class LoggerModule {
}
