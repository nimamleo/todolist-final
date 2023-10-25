import { Inject, Injectable } from '@nestjs/common';
import {
  IUserProvider,
  USER_DATABASE_PROVIDER,
} from '../infrastructure/database/providers/user.provider';
import { IUser, IUserEntity } from '../model/user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_DATABASE_PROVIDER)
    private readonly userRepository: IUserProvider,
  ) {}

  async createUser(iUser: IUser): Promise<IUserEntity> {
    return await this.userRepository.createUser(iUser);
  }
}
