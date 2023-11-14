import {
    Controller,
    Post,
    Res,
    UploadedFile,
    UploadedFiles,
} from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Filters } from '../../../common/validation/custom-validation/file-filter';
import { AssetService } from '../../../application/asset.service';
import { AbstractHttpController } from '../../../common/abstract-http.controller';
import { Ok } from '../../../common/result';
import { CreateFileResponse } from './models/createFile.model';
import { Response } from 'express';
import { getMimeTypeFromArrayBuffer } from '../../../common/utils/fileMimeType-extractor';
import { StdResponse } from '../../../common/std-response/std-response';
import { ApiStdResponse } from '../../../common/ApiStdResponse';
import { ApiFile } from '../../../common/swagger/api-file.decorator';
import { ApiFiles } from '../../../common/swagger/api-files.decorator';

@Controller('files')
@ApiTags('files')
export class AssetController extends AbstractHttpController {
    constructor(private readonly assetService: AssetService) {
        super();
    }
    @Post('upload')
    @ApiOperation({ summary: 'upload file' })
    @ApiExtraModels(CreateFileResponse, StdResponse)
    @ApiStdResponse(CreateFileResponse)
    @ApiFile('file', true, {
        fileFilter: Filters(['image/jpeg', 'image/png'], 1),
    })
    async createFile(
        @Res() response: Response,
        @UploadedFile()
        file: Express.Multer.File,
    ) {
        const mimetype = await getMimeTypeFromArrayBuffer(file.buffer);
        console.log(mimetype);
        const res = await this.assetService.createFile({
            fileName: file.originalname,
            size: file.size,
            mimetype: mimetype || '',
            // mimetype: file.mimetype,
            buffer: file.buffer,
        });
        if (res.isOk()) {
            super.sendResult(
                response,
                Ok<CreateFileResponse>({
                    id: res.value.id,
                    filePath: res.value.filePath,
                    size: res.value.size,
                    mimetype: res.value.mimetype,
                    createdAt: res.value.createdAt.toISOString(),
                    todoId: res.value?.todoId,
                }),
            );
        }
    }

    @Post('uploads')
    @ApiFiles('files', true)
    uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
        console.log(files);
    }
}
