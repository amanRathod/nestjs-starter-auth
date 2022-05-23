import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { Public } from './decorator';
import { AuthDto } from './dto';

@Controller('auth/api/v1')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  Login(@Body() dto: AuthDto) {
    return this.authservice.login(dto);
  }

  @Public()
  @Post('register')
  Register(@Body() user: User): Promise<{ email: string; id: string }> {
    console.log('userrr', user);
    return this.authservice.register(user);
  }

  @Get(':uuid')
  async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return uuid;
  }
}
