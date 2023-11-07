import { Injectable } from '@nestjs/common';
import { IBcryptProvider } from './provider/bcrypt.provider';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements IBcryptProvider {
    async compare(passwordString: string, hashPassword: string): Promise<boolean> {
        return await bcrypt.compare(passwordString, hashPassword);
    }
    async hash(data: string): Promise<string> {
        return await bcrypt.hash(data, 10);
    }
}
