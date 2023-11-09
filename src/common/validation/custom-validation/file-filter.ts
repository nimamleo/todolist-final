import {
    UnsupportedMediaTypeException,
    PayloadTooLargeException,
} from '@nestjs/common';

export function Filters(mimetypes: string[], size: number) {
    return (
        req,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void,
    ) => {
        const maxSize = size * 1024 * 1024;
        const fileSize = parseInt(req.headers['content-length']);
        if (!mimetypes.some((m) => file.mimetype.includes(m))) {
            callback(
                new UnsupportedMediaTypeException(
                    `File type is not matching: ${mimetypes.join(', ')}`,
                ),
                false,
            );
            return;
        }
        if (fileSize > maxSize) {
            callback(
                new PayloadTooLargeException(
                    `File size exceeded: ${maxSize} bytes`,
                ),
                false,
            );
            return;
        }

        callback(null, true);
    };
}
