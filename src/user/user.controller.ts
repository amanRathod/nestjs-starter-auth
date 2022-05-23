import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { getUser } from 'src/auth/decorator';
import { Roles } from 'src/auth/decorator/role.decorators';
import { Role } from 'src/auth/entity/role.enum';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles(Role.ADMIN)
  @Get()
  getUser(@getUser('id') id: string): Promise<User> {
    return this.userService.getUser(id);
  }
}
