import {
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export class ErrorHandler {
  static handle(
    error: any,
    logger: Logger,
    context: string,
    defaultMessage: string,
  ): never {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error(context, error);
    throw new InternalServerErrorException(defaultMessage);
  }
}
