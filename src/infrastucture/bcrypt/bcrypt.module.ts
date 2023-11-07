import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { BCRYPT_PROVIDER } from './provider/bcrypt.provider';

@Module({
    providers: [{ provide: BCRYPT_PROVIDER, useClass: BcryptService }],
    exports: [BCRYPT_PROVIDER],
})
export class BcryptModule {}
