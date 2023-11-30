import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IUserProvider } from '../provider/user.provider';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { IUser, IUserEntity } from 'src/model/user.model';
import { ITodolist, ITodolistEntity } from 'src/model/todolist.model';
import { ITodo, ITodoEntity } from 'src/model/todo.model';
import { TodoList } from './schema/todolist.schema';
import { Todo } from './schema/todo.scheam';
import { Err, Ok, Result } from '../../../common/result';
import { GenericErrorCode } from '../../../common/errors/generic-error';
import { HandleError } from '../../../common/decorator/handler-error.decorator';

@Injectable()
export class UserMongoService implements IUserProvider {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {}
    // ======================================TODO LIST ==============================================
    @HandleError
    async createTodolist(
        iTodolist: Partial<ITodolist>,
        userId: string,
    ): Promise<Result<ITodolistEntity>> {
        const todolist = TodoList.fromITodoList(iTodolist);

        const res = await this.userModel.findOneAndUpdate(
            { _id: new Types.ObjectId(userId) },
            { $push: { todoLists: todolist } },
        );

        if (!res) return Err('create todolist failed');

        return Ok(TodoList.toITodoListEntity(todolist));
    }
    @HandleError
    async getAllTodolist(userId: string): Promise<Result<ITodolistEntity[]>> {
        const res = await this.userModel.findOne(
            {
                _id: new Types.ObjectId(userId),
            },
            { todoLists: 1, _id: 0 },
        );
        if (!res) return Err('todolists not found', GenericErrorCode.NOT_FOUND);

        return Ok(
            res.todoLists.map((todolist) =>
                TodoList.toITodoListEntity(todolist),
            ),
        );
    }

    @HandleError
    async getOneTodoListById(
        todolistId: string,
        userId: string,
    ): Promise<Result<ITodolistEntity>> {
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
        if (!res) return Err('todo list not found', GenericErrorCode.NOT_FOUND);
        return Ok(TodoList.toITodoListEntity(res.todoLists[0]));
    }

    @HandleError
    async deleteTodolist(
        userId: string,
        todolistId: string,
    ): Promise<Result<boolean>> {
        const res = await this.userModel.updateOne(
            {
                _id: new Types.ObjectId(userId),
            },
            {
                $pull: { todoLists: { _id: new Types.ObjectId(todolistId) } },
            },
        );
        if (res.modifiedCount == 0) {
            return Err('delete todolist failed');
        }
        return Ok(res.modifiedCount >= 1);
    }

    // ======================================TODO  ==============================================
    @HandleError
    async createTodo(
        iTodo: Partial<ITodo>,
        userId: string,
        todolistId: string,
    ): Promise<Result<ITodoEntity>> {
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
        if (res.modifiedCount <= 0) return Err('create Todo failed');
        return Ok(Todo.toITodoEntity(todo));
    }

    @HandleError
    async getOneTodoList(
        query: FilterQuery<unknown>,
        userId: string,
    ): Promise<Result<ITodolistEntity>> {
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
        if (!res) {
            return Err('todo not found', GenericErrorCode.NOT_FOUND);
        }
        return Ok(TodoList.toITodoListEntity(res.todoLists[0]));
    }

    @HandleError
    async getAllTodo(
        userId: string,
        todolistId: string,
        page: number,
        perPage: number,
    ): Promise<Result<ITodoEntity[]>> {
        const res = await this.userModel
            .aggregate([
                {
                    $match: {
                        'todoLists._id': new Types.ObjectId(todolistId),
                    },
                },
                {
                    $unwind: '$todoLists',
                },
                {
                    $unwind: '$todoLists.todos',
                },
                {
                    $project: {
                        'todoLists.todos': 1,
                    },
                },
            ])
            .skip(perPage * (page - 1))
            .limit(perPage);

        if (!res) return Err('todos not found', GenericErrorCode.NOT_FOUND);

        return Ok(
            res.map((x) => {
                return Todo.toITodoEntity(x.todoLists.todos);
            }),
        );
    }
    @HandleError
    async getOneTodo(
        todoId: string,
        userId: string,
    ): Promise<Result<ITodoEntity>> {
        const res = await this.userModel.aggregate([
            {
                $match: {
                    'todoLists.todos._id': new Types.ObjectId(todoId),
                },
            },
            {
                $unwind: '$todoLists',
            },
            {
                $unwind: '$todoLists.todos',
            },
            {
                $match: {
                    'todoLists.todos._id': new Types.ObjectId(todoId),
                },
            },
            {
                $project: {
                    'todoLists.todos': 1,
                },
            },
        ]);
        if (!res) return Err('todo not found');

        return Ok(Todo.toITodoEntity(res?.[0].todoLists.todos));
    }

    @HandleError
    async deleteTodo(todoId: string, userId: string): Promise<Result<boolean>> {
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
        if (res.modifiedCount == 0) return Err('delete tod failed ');
        return Ok(res.modifiedCount >= 1);
    }

    @HandleError
    async updateTodo(
        todoId: string,
        todolistId: string,
        ITodo: Partial<ITodo>,
        userId: string,
    ): Promise<Result<ITodoEntity>> {
        const newTodo = Todo.fromITodo({ ...ITodo, id: todoId });
        const res = await this.userModel.updateOne(
            {
                _id: new Types.ObjectId(userId),
            },
            {
                $set: {
                    'todoLists.$[list].todos.$[customData]': newTodo,
                },
            },
            {
                multi: false,
                upsert: false,
                arrayFilters: [
                    {
                        'list._id': {
                            $eq: new Types.ObjectId(todolistId),
                        },
                    },
                    {
                        'customData._id': {
                            $eq: new Types.ObjectId(todoId),
                        },
                    },
                ],
            },
        );
        if (res.modifiedCount == 0) return Err('update todo failed');

        return Ok(Todo.toITodoEntity(newTodo));
    }

    // ======================================USER  ==============================================
    @HandleError
    async getUserById(id: string): Promise<Result<IUserEntity>> {
        const res = await this.userModel.findOne({
            _id: new Types.ObjectId(id),
        });
        if (!res) return Err('user not found', GenericErrorCode.NOT_FOUND);
        return Ok(User.toIUserEntity(res));
    }

    @HandleError
    async getUser(query: FilterQuery<unknown>): Promise<Result<IUserEntity>> {
        const res = await this.userModel.findOne(query);
        if (!res) return Err('user not found', GenericErrorCode.NOT_FOUND);
        return Ok(User.toIUserEntity(res));
    }

    @HandleError
    async createUser(iUser: IUser): Promise<Result<IUserEntity>> {
        const user = User.fromIUser(iUser);

        const res = await this.userModel.create(user);

        if (!res) return Err('create user failed');
        return Ok(User.toIUserEntity(res));
    }

    async deleteUserById(id: string): Promise<Result<boolean>> {
        const res = await this.userModel.deleteOne({
            _id: new Types.ObjectId(id),
        });
        if (res.deletedCount == 0) return Err('delete user failed');
        return Ok(res.deletedCount >= 1);
    }

    @HandleError
    async updateUserRefreshToken(
        userId: string,
        refreshToken: string,
    ): Promise<Result<boolean>> {
        const updateResult = await this.userModel.updateOne(
            { _id: new Types.ObjectId(userId) },
            {
                $set: { refreshToken: refreshToken },
            },
        );
        if (updateResult.modifiedCount == 0)
            return Err('update refresh token failed');

        return Ok(updateResult.modifiedCount >= 1);
    }
}
