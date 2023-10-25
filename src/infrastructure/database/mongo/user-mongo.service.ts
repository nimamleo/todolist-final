import { IUserProvider } from '../providers/user.provider';
import { Injectable } from '@nestjs/common';
import { IUser, IUserEntity } from '../../../model/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserMongoService implements IUserProvider {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async createUser(iUser: IUser): Promise<IUserEntity> {
    const user = User.fromIUser(iUser);

    const res = await this.userModel.create(user);

    return User.toIUserEntity(res);
  }

  async getUserById(id: string): Promise<IUserEntity> {
    const res = await this.userModel.findOne({
      _id: new Types.ObjectId(id),
    });

    return User.toIUserEntity(res);
  }

  async updateUser(id: string, iUser: IUser): Promise<IUserEntity> {
    const user = User.fromIUser(iUser);

    const res = await this.userModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
      },
      user,
      {
        new: true,
      },
    );

    return User.toIUserEntity(res);
  }
}
