import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export type User = {
  id: number;
  name: string;
  password: string;
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getUser(id: string): Promise<any> {
    try {
      return this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
