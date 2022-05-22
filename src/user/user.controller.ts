import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { getUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUser(@getUser('id') id: string): Promise<User> {
    return this.userService.getUser(id);
  }
}
