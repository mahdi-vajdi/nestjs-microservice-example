import { status } from '@grpc/grpc-js';
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const grpcCode = exception.code ?? exception.getError?.()?.code ?? status.INTERNAL;
    const message = exception.details || exception.message || 'Internal server error';

    const httpStatus = this.mapGrpcStatusToHttp(grpcCode);

    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`gRPC Error [Code ${grpcCode}]: ${message}`);
    } else {
      this.logger.warn(`Client Error [Code ${grpcCode} -> HTTP ${httpStatus}]: ${message}`);
    }

    response.status(httpStatus).json({
      statusCode: httpStatus,
      message,
      error: this.getHttpStatusText(httpStatus),
    });
  }

  private getHttpStatusText(httpStatus: HttpStatus): string {
    switch (httpStatus) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal Server Error';
      case HttpStatus.NOT_IMPLEMENTED:
        return 'Not Implemented';
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 'Service Unavailable';
      case HttpStatus.GATEWAY_TIMEOUT:
        return 'Gateway Timeout';
      case HttpStatus.PRECONDITION_FAILED:
        return 'Precondition Failed';
      case HttpStatus.REQUEST_TIMEOUT:
        return 'Request Timeout';
      default:
        return 'Error';
    }
  }

  private mapGrpcStatusToHttp(grpcCode: number): HttpStatus {
    switch (grpcCode) {
      case status.OK:
        return HttpStatus.OK;
      case status.CANCELLED:
        return HttpStatus.REQUEST_TIMEOUT;
      case status.UNKNOWN:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      case status.INVALID_ARGUMENT:
        return HttpStatus.BAD_REQUEST;
      case status.DEADLINE_EXCEEDED:
        return HttpStatus.GATEWAY_TIMEOUT;
      case status.NOT_FOUND:
        return HttpStatus.NOT_FOUND;
      case status.ALREADY_EXISTS:
        return HttpStatus.CONFLICT;
      case status.PERMISSION_DENIED:
        return HttpStatus.FORBIDDEN;
      case status.RESOURCE_EXHAUSTED:
        return HttpStatus.TOO_MANY_REQUESTS;
      case status.FAILED_PRECONDITION:
        return HttpStatus.PRECONDITION_FAILED;
      case status.ABORTED:
        return HttpStatus.CONFLICT;
      case status.OUT_OF_RANGE:
        return HttpStatus.BAD_REQUEST;
      case status.UNIMPLEMENTED:
        return HttpStatus.NOT_IMPLEMENTED;
      case status.INTERNAL:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      case status.UNAVAILABLE:
        return HttpStatus.SERVICE_UNAVAILABLE;
      case status.DATA_LOSS:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      case status.UNAUTHENTICATED:
        return HttpStatus.UNAUTHORIZED;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
