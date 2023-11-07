import { Result } from '../result';
import { StdStatus } from './std-status';
import { genericCodeToHttpStatus } from '../errors/generic-error';
import { ApiProperty } from '@nestjs/swagger';

export class StdResponse<T> {
  @ApiProperty()
  public status: string;
  @ApiProperty()
  public message: string;
  public data: T;

  constructor(data: T, message: string, status: string) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static fromResult<T>(result: Result<T>, message = ''): StdResponse<T> {
    if (result.isOk()) {
      return new StdResponse<T>(
        result.value,
        message,
        StdStatus.getStatus(200),
      );
    }

    return new StdResponse<T>(
      result.err.data,
      result.err.message,
      StdStatus.getStatus(genericCodeToHttpStatus(result.err.code)),
    );
  }
}
