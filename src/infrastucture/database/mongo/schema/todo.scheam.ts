import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ITodoEntity } from 'src/model/todo.model';

export class Todo {
    _id: Types.ObjectId;

    @Prop()
    title: string;

    @Prop()
    description: string;

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
        todo.createdAt = iTodoEntity.createdAt || new Date();
        todo.updatedAt = new Date();
        console.log(todo);

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
            createdAt: todo.createdAt,
            updatedAt: todo.updatedAt,
        };
    }
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
