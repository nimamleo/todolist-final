import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { StdResponse } from './std-response/std-response';

export const ApiStdResponse = <TModel extends Type<any>>(model: TModel) => {
    return applyDecorators(
        ApiOkResponse({
            schema: {
                title: `StdResponse[${model.name}]`,
                allOf: [
                    { $ref: getSchemaPath(StdResponse) },
                    {
                        properties: {
                            data: {
                                type: 'object',
                                $ref: getSchemaPath(model),
                            },
                        },
                    },
                ],
            },
        }),
    );
};
