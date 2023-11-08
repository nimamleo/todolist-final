import { Response } from 'express';
import { StdStatus } from './std-response/std-status';
import { Result } from './result';
import { StdResponse } from './std-response/std-response';

export abstract class AbstractHttpController {
    protected sendResult<T>(
        res: Response,
        result: Result<T>,
        message = '',
    ): void {
        const stdRes = StdResponse.fromResult(result, message);

        this.sendStdResponse<T>(res, stdRes);
    }

    protected sendStdResponse<T>(res: Response, stdRes: StdResponse<T>): void {
        res.status(StdStatus.getCode(stdRes.status)).json(stdRes);
    }
}
