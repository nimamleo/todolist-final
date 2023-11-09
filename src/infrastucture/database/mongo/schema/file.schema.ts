import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { IFile, IFileEntity } from '../../../../model/file.model';
import { Todo } from './todo.scheam';

@Schema()
export class File {
    _id: Types.ObjectId;

    @Prop()
    size: number;

    @Prop()
    filePath: string;

    @Prop()
    fileName: string;

    @Prop()
    mimetype: string;

    @Prop({ type: Types.ObjectId })
    todoId?: Types.ObjectId;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
    static fromIFile(iFileEntity: Partial<IFileEntity>): File {
        if (!iFileEntity) {
            return null;
        }
        const file = new File();
        file._id = new Types.ObjectId(iFileEntity.id);
        file.size = iFileEntity.size;
        file.filePath = iFileEntity.filePath;
        file.fileName = iFileEntity.fileName;
        file.mimetype = iFileEntity.mimetype;
        file.todoId = new Types.ObjectId(iFileEntity.todoId);
        file.createdAt = file.createdAt || new Date();
        file.updatedAt = new Date();
        return file;
    }
    static toIFileEntity(file: File): Partial<IFileEntity> {
        if (!file) {
            return null;
        }

        return {
            id: file._id.toString(),
            filePath: file.filePath,
            fileName: file.fileName,
            mimetype: file.mimetype,
            size: file.size,
            todoId: file.todoId.toString(),
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
        };
    }
}

export const FileSchema = SchemaFactory.createForClass(File);
