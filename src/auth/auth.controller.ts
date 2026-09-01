import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetRawHeaders, GetUser } from './decorators';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully with JWT token',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (validation error or email already in use)',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and get JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns user object and Bearer token',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (validation error)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (invalid credentials or user inactive)',
  })
  login(@Body() loginUserDto: LoginDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('me')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Verify current authentication status and renew token',
  })
  @ApiResponse({
    status: 200,
    description: 'Session valid, returns current user data and renewed token',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (missing or invalid token)',
  })
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Protected route test with basic AuthGuard' })
  @ApiResponse({
    status: 200,
    description: 'Access granted',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
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

  @Get('private2')
  @Auth(ValidRoles.admin, ValidRoles.superSu)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Role-protected route test (admin / super-su required)',
  })
  @ApiResponse({
    status: 200,
    description: 'Access granted for admin or super-su role',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (insufficient role permissions)',
  })
  testingPrivate2(@GetUser() user: User) {
    return {
      ok: true,
      message: 'hey',
      user,
    };
  }
}
