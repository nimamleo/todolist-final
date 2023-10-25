import { GenericError, GenericErrorCode } from './errors/generic-error';

export class Result<T> {
  constructor(
    public readonly value: T,
    public readonly err: GenericError,
  ) {
    if (this.isError() && this.isOk()) {
      this.value = null;
    }
    if (!this.isError() && !this.isOk()) {
      this.err = new GenericError('Unknown error', GenericErrorCode.INTERNAL);
    }
  }

  public isOk(): boolean {
    return this.value != null;
  }

  public isError(): boolean {
    return !!this.err;
  }
}

export function Ok<T>(v: T): Result<T> {
  return new Result<T>(v, null);
}

export function Err(
  e: Error | string | GenericError,
  code?: GenericErrorCode,
  data?: any,
): Result<any> {
  if (e instanceof String || typeof e === 'string') {
    return new Result<any>(
      null,
      new GenericError(new Error(e as string), code, data),
    );
  }
  if (e instanceof GenericError) {
    return new Result<any>(null, e);
  }

  return new Result<any>(null, new GenericError(e, code, data));
}
