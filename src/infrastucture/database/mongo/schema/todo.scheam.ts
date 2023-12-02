import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { ITodoEntity } from 'src/model/todo.model';
import { IFile } from '../../../../model/file.model';

export class Todo {
    _id: Types.ObjectId;

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'File' })
    imageId: IFile;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    static fromITodo(iTodoEntity: Partial<ITodoEntity>): Todo {
        if (!iTodoEntity) {
            return null;
        }

        const todo = new Todo();
        todo._id = new Types.ObjectId(iTodoEntity.id);
        todo.title = iTodoEntity.title;
        todo.description = iTodoEntity.description;
        todo.imageId = iTodoEntity.imageId;
        todo.createdAt = iTodoEntity.createdAt || new Date();
        todo.updatedAt = new Date();

        return todo;
    }

    static toITodoEntity(todo: Todo): ITodoEntity {
        if (!todo) {
            return null;
        }

        return {
            id: todo._id.toString(),
            title: todo.title,
            description: todo.description,
            imageId: todo.imageId,
            createdAt: todo.createdAt,
            updatedAt: todo.updatedAt,
        };
    }
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
