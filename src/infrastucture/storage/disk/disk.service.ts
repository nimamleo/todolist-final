import { Inject, Injectable } from '@nestjs/common';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { IFile } from '../../../model/file.model';
import { Err, Ok, Result } from '../../../common/result';
import { IAuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { HandleError } from '../../../common/decorator/handler-error.decorator';
import { IFileProvider } from '../provider/file.provider';
@Injectable()
export class DiskService implements IFileProvider {
    constructor(private readonly configService: ConfigService) {}
    @HandleError
    async createFile(file: IFile): Promise<Result<IFile>> {
        const size = 1;
        const mimetypes = ['image/jpeg', 'image/png'];
        const maxSize = size * 1024 * 1024;
        if (file.size >= maxSize) {
            return Err(`File size exceeded: ${maxSize} bytes`);
        }
        if (!mimetypes.some((m) => file.mimetype.includes(m))) {
            return Err(`File type is not matching: ${mimetypes.join(', ')}`);
        }

        const date = new Date();
        const year = date.getFullYear().toString();
        const month = date.getMonth().toString();
        const day = date.getDay().toString();
        const route = this.configService.get('ROUTE');
        const uploadPath = path.join(__dirname, route, year, month, day);
        return Ok(await this.saveFile(file, uploadPath));
    }
    serveImage(imagePath: string): Promise<Result<any>> {
        return new Promise((resolve, reject) => {
            try {
                const stream = fs.createReadStream(imagePath);
                resolve(Ok(stream));
            } catch (e) {
                reject(Err(e));
            }
        });
    }

    deleteFile(filePath: string): Promise<Result<boolean>> {
        return new Promise((resolve, reject) => {
            try {
                fs.unlinkSync(filePath);
                resolve(Ok(true));
            } catch (e) {
                reject(Err(e));
            }
        });
    }
    private saveFile(file: IFile, uploadPath: string): Promise<IFile> {
        const fileName = `${uuidv4()}-${file.fileName}`;
        const filePath = path.join(uploadPath, fileName);

        return new Promise<IFile>((resolve, reject) => {
            try {
                fs.mkdirSync(uploadPath, { recursive: true });
                fs.writeFileSync(filePath, file.buffer);
                resolve({
                    size: file.size,
                    buffer: file.buffer,
                    mimetype: file.mimetype,
                    todoId: '',
                    filePath: filePath,
                    fileName: fileName,
                });
            } catch (e) {
                reject(e);
            }
        });
    }
}
