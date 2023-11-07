import { Body, Injectable, InternalServerErrorException } from '@nestjs/common';
import { IUserProvider } from '../provider/user.provider';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { IUser, IUserEntity } from 'src/model/user.model';
import { ITodolist, ITodolistEntity } from 'src/model/todolist.model';
import { ITodo, ITodoEntity } from 'src/model/todo.model';
import { TodoList } from './schema/todolist.schema';
import { Todo } from './schema/todo.scheam';

@Injectable()
export class UserMongoService implements IUserProvider {
    constructor(
        @InjectModel(TodoList.name)
        private readonly todolistModel: Model<TodoList>,
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {}
    async getUserById(id: string): Promise<IUserEntity> {
        const res = await this.userModel.findOne({
            _id: new Types.ObjectId(id),
        });
        // if(!res) 
        return User.toIUserEntity(res);
    }

    async getUser(query: FilterQuery<unknown>): Promise<IUserEntity> {
        const res = await this.userModel.findOne(query);
        return User.toIUserEntity(res);
    }

    async createUser(iUser: IUser): Promise<IUserEntity> {
        const user = User.fromIUser(iUser);

        const res = await this.userModel.create(user);

        return User.toIUserEntity(res);
    }

    async deleteUserById(id: string): Promise<boolean> {
        const res = await this.userModel.deleteOne({
            _id: new Types.ObjectId(id),
        });
        return res.deletedCount > 1;
    }

    async createTodolist(
        iTodolist: Partial<ITodolist>,
        userId: string,
    ): Promise<ITodolistEntity> {
        const todolist = TodoList.fromITodoList(iTodolist);

        const res = await this.userModel.findOneAndUpdate(
            { _id: new Types.ObjectId(userId) },
            { $push: { todoLists: todolist } },
        );
        console.log(res);

        if (!res)
            throw new InternalServerErrorException('create todolist failed');

        return TodoList.toITodoListEntity(todolist);
    }
    async getAllTodolist(userId: string): Promise<ITodolistEntity[]> {
        const res = await this.userModel.findOne(
            {
                _id: new Types.ObjectId(userId),
            },
            { todoLists: 1, _id: 0 },
        );
        console.log(res);

        return res.todoLists.map((todolist) =>
            TodoList.toITodoListEntity(todolist),
        );
    }

    async getOneTodoListById(
        userId: string,
        todolistId: string,
    ): Promise<ITodolistEntity> {
        const res = await this.userModel.findOne(
            {
                _id: new Types.ObjectId(userId),
                'todoLists._id': new Types.ObjectId(todolistId),
            },
            {
                'todoLists.$': 1,
                _id: 0,
            },
        );
        return TodoList.toITodoListEntity(res.todoLists[0]);
    }

    async deleteTodolist(userId: string, todolistId: string): Promise<boolean> {
        const res = await this.userModel.updateOne({
            _id: new Types.ObjectId(userId),
            $pull: { todoLists: { _id: new Types.ObjectId(todolistId) } },
        });
        return res.modifiedCount > 1;
    }

    async createTodo(
        iTodo: Partial<ITodo>,
        userId: string,
        todolistId: string,
    ): Promise<ITodoEntity> {
        const todo = Todo.fromITodo(iTodo);
        const res = await this.userModel.updateOne(
            {
                _id: new Types.ObjectId(userId),
                'todoLists._id': new Types.ObjectId(todolistId),
            },
            {
                $push: {
                    'todoLists.$.todos': todo,
                },
            },
        );
        if (res.modifiedCount <= 0)
            throw new InternalServerErrorException('create Todo failed');
        return Todo.toITodoEntity(todo);
    }

    async getOneTodoList(
        query: FilterQuery<unknown>,
        userId: string,
    ): Promise<ITodolistEntity> {
        const res = await this.userModel.findOne(
            {
                _id: new Types.ObjectId(userId),
                todoLists: query,
            },
            {
                'todoLists.$': 1,
                _id: 0,
            },
        );
        return TodoList.toITodoListEntity(res.todoLists[0]);
    }

    async getAllTodo(
        userId: string,
        todolistId: string,
    ): Promise<ITodoEntity[]> {
        const res = await this.userModel.findOne({
            _id: new Types.ObjectId(userId),
            'todoLists._id': new Types.ObjectId(todolistId),
        });

        return res.todoLists[0].todos.map((todo) => Todo.toITodoEntity(todo));
    }
    async getOneTodo(todoId: string, userId: string): Promise<ITodoEntity> {
        console.log({ todoId, userId });

        const res = await this.userModel.findOne({
            _id: new Types.ObjectId(userId),
            'todoLists.todos._id': new Types.ObjectId(todoId),
        });

        return Todo.toITodoEntity(res.todoLists?.[0].todos?.[0]);
    }

    async deleteTodo(todoId: string, userId: string): Promise<boolean> {
        const res = await this.userModel.updateOne(
            {
                _id: new Types.ObjectId(userId),
                'todoLists.todos._id': new Types.ObjectId(todoId),
            },
            {
                $pull: {
                    'todoLists.$.todos': { _id: new Types.ObjectId(todoId) },
                },
            },
        );

        return res.modifiedCount >= 1;
    }

    async updateTodo(
        todoId: string,
        ITodo: Partial<ITodo>,
        userId: string,
    ): Promise<ITodoEntity> {
        const newTodo = Todo.fromITodo({ ...ITodo, id: todoId });

        await this.userModel.findOneAndUpdate(
            {
                _id: new Types.ObjectId(userId),
                'todoLists.todos._id': new Types.ObjectId(todoId),
            },
            {
                $set: { 'todoLists.$.todos': newTodo },
            },
            {
                returnDocument: 'after',
            },
        );

        return Todo.toITodoEntity(newTodo);
    }
}
