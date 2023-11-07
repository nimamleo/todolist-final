import { CreateAuthDto } from 'src/io/http/validation/auth/create-auth.dto';
import { IUserEntity } from 'src/model/user.model';

export interface IBcryptReader {
    compare(passwordString: string, hashPassword: string): Promise<boolean>;
}
export interface IBcryptWriter {
    hash(data: string): Promise<string>;
}

export const BCRYPT_PROVIDER = 'bcrypt-provider';

export interface IBcryptProvider extends IBcryptReader, IBcryptWriter {}
