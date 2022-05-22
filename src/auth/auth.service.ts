import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  login = async (dto: AuthDto) => {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: dto.email },
      });
      if (!user) {
        throw new NotFoundException('Invalid credentials');
      }
      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (!isMatch) {
        throw new ForbiddenException('Invalid credentials');
      }
      const payload = {
        sub: user.id,
        email: user.email,
      };

      // return this.signToken(user.id, user.email);
      return {
        access_token: this.jwt.sign(payload),
      };
    } catch (error) {
      throw error;
    }
  };

  register = async (user: User) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      const newUser = await this.prisma.user.create({
        data: {
          email: user.email,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
        },
      });
      return newUser;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email already exists');
      }
      throw error;
    }
  };

  signToken = async (
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> => {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET_KEY');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '2h',
      secret: secret,
    });

    return {
      access_token: token,
    };
  };
}
