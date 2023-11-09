import { Inject, Injectable } from '@nestjs/common';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class DiskService {
    async createFile(file: Express.Multer.File): Promise<string> {
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = date.getMonth().toString();
        const day = date.getDay().toString();
        const uploadPath = path.join(
            __dirname,
            '..',
            '..',
            'uploads',
            year,
            month,
            day,
        );
        const fileName = `${uuidv4()}-${file.originalname}`;
        const filePath = join(uploadPath, fileName);
        const fsPromise = fs.promises;
        await fsPromise.mkdir(uploadPath, { recursive: true });
        await fsPromise.writeFile(filePath, file.buffer);
        return fileName;
    }
}
