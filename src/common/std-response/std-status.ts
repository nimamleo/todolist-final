export class StdStatus {
  public static status = {
    200: 'success',
    400: 'bad request',
    401: 'not auth',
    403: 'permission denied',
    404: 'not found',
    422: 'bad request',
    500: 'internal error',
  };

  public static getStatus(code: number): string {
    return this.status[`${code}`];
  }

  public static getCode(status: string): number {
    for (const s in this.status) {
      if (this.status[s] === status) {
        return parseInt(s);
      }
    }
    return 0;
  }
}
