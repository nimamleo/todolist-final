import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { IUser, IUserEntity } from '../../../../model/user.model';

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Date, required: false })
  createdAt: Date;

  @Prop({ type: Date, required: false })
  updatedAt: Date;

  static fromIUser(iUser: IUser): User {
    if (!iUser) {
      return null;
    }

    const user = new User();
    user.username = iUser.username;
    user.password = iUser.password;

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
      todos: [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
