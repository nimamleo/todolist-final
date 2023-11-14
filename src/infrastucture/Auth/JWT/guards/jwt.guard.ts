import { AuthGuard } from '@nestjs/passport';
import { Err } from '../../../../common/result';
import { GenericErrorCode } from '../../../../common/errors/generic-error';

export class JwtAuthGuard extends AuthGuard('jwt') {}
//     constructor(private readonly isOptional: boolean = false) {
//         super();
//     }
//
//     handleRequest(err, user, info, context) {
//         if (err || !user) {
//             if (this.isOptional) {
//                 return { id: '123' };
//             }
//             return Err('Unauthorized', err, GenericErrorCode.UNAUTHORIZED);
//         }
//
//         return user;
//     }
// }
