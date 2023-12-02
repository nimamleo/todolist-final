import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export function ApiFile(
    fieldName: string = 'file',
    required: boolean = false,
    body?: any,
    localOptions?: MulterOptions,
) {
    return applyDecorators(
        UseInterceptors(FileInterceptor(fieldName, localOptions)),
        ApiConsumes('multipart/form-data'),
        ApiBody({
            schema: {
                type: 'object',
                required: required ? [fieldName] : [],
                properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    file: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        }),
    );
}
