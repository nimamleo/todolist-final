import { Logger } from '@nestjs/common';
import { Err } from '../result';

const errorLogger = new Logger('HandleError');

export function HandleError(
    _target: any,
    _methodName: string,
    descriptor: PropertyDescriptor,
) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        try {
            return await originalMethod.apply(this, args);
        } catch (error) {
            errorLogger.error(
                `Error in ${_target.constructor.name}@${_methodName}: ${error}`,
            );
            errorLogger.error(error.stack);
            return Err(error);
        }
    };
}
