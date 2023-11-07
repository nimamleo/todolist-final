import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Todo } from './todo.scheam';
import { ITodolist, ITodolistEntity } from 'src/model/todolist.model';

export class TodoList {
    _id: Types.ObjectId;

    @Prop({ required: true })
    listTitle: string;

    @Prop({ type: Types.Array })
    todos: Todo[];

    @Prop({ required: false, type: Date.now })
    createdAt: Date;

    @Prop({ required: false, type: Date.now })
    updatedAt: Date;

    static fromITodoList(iTodoListEntity: Partial<ITodolistEntity>): TodoList {
        if (!iTodoListEntity) {
            return null;
        }

        const todoList = new TodoList();

        todoList._id = new Types.ObjectId(iTodoListEntity.id);
        todoList.listTitle = iTodoListEntity.listTitle;
        todoList.createdAt = iTodoListEntity.createdAt || new Date();
        todoList.updatedAt = new Date();
        if (iTodoListEntity.todos && iTodoListEntity.todos.length !== 0) {
            todoList.todos = iTodoListEntity.todos.map((x) =>
                Todo.fromITodo(x),
            );
        } else {
            todoList.todos = [];
        }

        return todoList;
    }

    static toITodoListEntity(todoList: TodoList): ITodolistEntity {
        if (!todoList) {
            return null;
        }
        return {
            id: todoList._id.toString(),
            listTitle: todoList.listTitle,
            todos: todoList.todos.map((x) => Todo.toITodoEntity(x)),
            createdAt: todoList.createdAt,
            updatedAt: todoList.updatedAt,
        };
    }
}

export const TodoListSchema = SchemaFactory.createForClass(Todo);
