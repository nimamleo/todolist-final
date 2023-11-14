import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly shouldAuth = true) {
        super();
    }
}
