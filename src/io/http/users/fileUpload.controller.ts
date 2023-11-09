import { Controller, Post, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiFile } from '../../../common/decorator/api-file.decorator';
import { ApiFiles } from '../../../common/decorator/api-files.decorator';
import { Filters } from '../../../common/validation/custom-validation/file-filter';
import { AssetService } from '../../../application/asset-service';

@Controller('files')
@ApiTags('files')
export class FileUploadController {
    constructor(private readonly assetService: AssetService) {}
    @Post('upload')
    @ApiOperation({ summary: 'upload file' })
    @ApiFile('file', true, {
        fileFilter: Filters(['image/jpeg', 'image/png'], 1),
    })
    async uploadFile(
        @UploadedFile()
        file: Express.Multer.File,
    ) {
        // return await this.uploadService.uploadFile(file);
    }

    @Post('uploads')
    @ApiFiles('files', true)
    uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
        console.log(files);
    }
}
