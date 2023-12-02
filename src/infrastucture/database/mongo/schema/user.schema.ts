import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId, Types } from 'mongoose';
import { IUser, IUserEntity } from 'src/model/user.model';
import { TodoList } from './todolist.schema';
import { Role } from '../../../../common/enum/role.enum';

@Schema({ timestamps: true })
export class User {
    _id: ObjectId;

    @Prop({ required: true, type: String })
    username: string;

    @Prop({ required: true, type: String })
    password: string;

    @Prop({ required: true, type: String })
    role: Role;

    @Prop({ required: false, type: String })
    refreshToken: string;

    @Prop({
        type: Types.Array,
    })
    todoLists: TodoList[];

    @Prop({ required: false, type: Date })
    createdAt: Date;

    @Prop({ required: false, type: Date })
    updatedAt: Date;

    static fromIUser(iUser: IUser): User {
        if (!iUser) {
            return null;
        }

        const user = new User();
        user.username = iUser.username;
        user.password = iUser.password;
        user.role = iUser.role;
        user.refreshToken = iUser.refreshToken;
        if (iUser.todoLists && iUser.todoLists.length !== 0) {
            user.todoLists = iUser.todoLists.map((x) =>
                TodoList.fromITodoList(x),
            );
        } else {
            user.todoLists = [];
        }

        return user;
    }

    static toIUserEntity(user: User): IUserEntity {
        if (!user) {
            return null;
        }

        return {
            id: user._id.toString(),
            username: user.username,
            password: user.password,
            role: user.role,
            refreshToken: user.refreshToken,
            todoLists: user.todoLists.map((x) => TodoList.toITodoListEntity(x)),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}

export const UserSchema = SchemaFactory.createForClass(User);
