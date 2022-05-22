import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth/api/v1')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  Login(@Body() dto: AuthDto) {
    return this.authservice.login(dto);
  }

  @Post('register')
  Register(@Body() user: User): Promise<{ email: string; id: string }> {
    return this.authservice.register(user);
  }

  @Get(':uuid')
  async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return uuid;
  }
}
