import { applyDecorators, Type, UseInterceptors } from '@nestjs/common';
import { ApiExtraModels, ApiOperation } from '@nestjs/swagger';
import { ApiStdResponse } from '../ApiStdResponse';
import { StdResponse } from '../std-response/std-response';

export function ApiUser<TModel extends Type<any>>(model: TModel) {
    return applyDecorators(
        // ApiOperation({ summary: summary }),
        ApiExtraModels(model),
        ApiStdResponse(model),
    );
}
