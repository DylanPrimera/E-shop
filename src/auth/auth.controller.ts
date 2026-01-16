import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetRawHeaders, GetUser } from './decorators';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivate(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @GetRawHeaders() headers: string[],
  ) {
    return {
      ok: true,
      message: 'hey',
      user,
      userEmail,
      headers,
    };
  }
}
