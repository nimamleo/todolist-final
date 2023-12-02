import { AuthGuard } from '@nestjs/passport';
import { Err } from '../../../../common/result';
import { GenericErrorCode } from '../../../../common/errors/generic-error';

export class JwtAuthGuard extends AuthGuard('jwt') {}
