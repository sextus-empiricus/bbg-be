import {
   ArgumentsHost,
   Catch,
   ExceptionFilter,
   HttpException,
   HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
class GlobalExceptionFilter implements ExceptionFilter {
   catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest<Request>();
      const response = ctx.getResponse<Response>();
      const status =
         exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

      const message =
         exception instanceof HttpException
            ? (exception.getResponse() as any).message
            : 'Internal server error.';

      console.log(exception);

      response.status(status).json({
         status: 'failed',
         statusCode: status,
         message,
         timestamp: new Date().toISOString(),
         path: request.url,
      });
   }
}

export { GlobalExceptionFilter };
