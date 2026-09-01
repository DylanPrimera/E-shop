/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

interface ExceptionError {
  code: string;
  detail: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      const { password: _, ...userWithoutPassword } = user as any;
      await this.userRepository.save(user);

      return {
        ...userWithoutPassword,
        token: this.generateJwt({
          userId: user.id,
          email: user.email,
          fullName: user.fullName,
          roles: user.roles,
        }),
      };
    } catch (error) {
      this.handleExceptions(error as ExceptionError);
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        fullName: true,
        roles: true,
      },
    });
    const { password: _, ...userWithoutPassword } = user as any;

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Invalid credentials');

    return {
      user: userWithoutPassword,
      token: this.generateJwt({
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
      }),
    };
  }

  checkAuthStatus(user: User) {
    return {
      user,
      token: this.generateJwt({
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
      }),
    };
  }

  private generateJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleExceptions(error: ExceptionError): never {
    if (error?.code === '23505') throw new BadRequestException(error?.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
