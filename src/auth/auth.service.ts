import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async Register(createUserDto: Prisma.UserCreateInput) {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    console.log({ hash });

    return await this.databaseService.user.create({
      data: {
        username: createUserDto.username,
        password: hash,
      },
    });
  }
  async SingIn(userSignInput: Prisma.UserCreateInput) {
    const { password: hashedPassword, username } =
      await this.databaseService.user.findUnique({
        where: {
          username: userSignInput.username,
        },
      });
    if (!username) throw new NotFoundException('username not found');
    const isMatch = await bcrypt.compare(
      userSignInput.password,
      hashedPassword,
    );
    if (!isMatch) throw new UnauthorizedException('password not correct');
    if (isMatch) {
      return {
        access_token: await this.jwtService.signAsync({ username }),
      };
    }
  }
}
