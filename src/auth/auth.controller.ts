import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.authService.Register(createUserDto);
  }

  @Post('signin')
  SignIn(@Body() userSignInput: Prisma.UserCreateInput) {
    return this.authService.SingIn(userSignInput);
  }
}
