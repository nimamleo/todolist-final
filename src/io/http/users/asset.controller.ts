import {
    Controller,
    Get,
    Param,
    Post,
    Res,
    StreamableFile,
    UploadedFile,
    UploadedFiles,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
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
import { join } from 'path';
import * as fs from 'fs';
import { GetUser } from '../../../common/decorator/get-user.decorator';
import { IUser, IUserEntity } from '../../../model/user.model';
import { JwtAuthGuard } from '../../../infrastucture/Auth/JWT/guards/jwt.guard';

@Controller('files')
@ApiTags('files')
export class AssetController extends AbstractHttpController {
    constructor(private readonly assetService: AssetService) {
        super();
    }
    @Post('upload/:id')
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
        @Param('id') todoId: string,
    ) {
        // const mimetype = await getMimeTypeFromArrayBuffer(file.buffer);
        const res = await this.assetService.createFile(
            {
                fileName: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                buffer: file.buffer,
            },
            todoId,
        );
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

    @Get('serveImage/:id')
    @ApiOperation({ summary: 'serve image' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async serveImage(
        @Param('id') imageId: string,
        @GetUser() user: IUserEntity,
        @Res({ passthrough: true }) response: Response,
    ) {
        const res = await this.assetService.serveImage(imageId, user.id);

        response.set({
            'Content-Type': res.value.mimetype,
        });
        const readStream = res.value.stream;
        return new StreamableFile(readStream);
    }
}
