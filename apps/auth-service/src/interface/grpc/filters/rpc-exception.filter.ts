import { DomainException } from '@app/common';
import { status } from '@grpc/grpc-js';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class GlobalRpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalRpcExceptionFilter.name);

  catch(exception: Error, _host: ArgumentsHost): RpcException {
    this.logger.error(exception.message, exception.stack);

    let code = status.INTERNAL;
    let message = 'Internal server error';

    if (exception instanceof DomainException) {
      code = status.INVALID_ARGUMENT; // Map custom logic here
      message = exception.message;
    }

    return new RpcException({
      code,
      message,
    });
  }
}
