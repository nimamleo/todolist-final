import { Controller } from '@nestjs/common';
import { UserService } from '../../application/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
}
