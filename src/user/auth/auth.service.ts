import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

interface SignupParams {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
}

interface LoginParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private readonly saltOrRounds = 10;

  constructor(private readonly prismaService: PrismaService) {}

  async signup({
    email,
    password,
    first_name,
    last_name,
    phone,
  }: SignupParams) {
    const userExist = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userExist) throw new ConflictException();

    const hash = await bcrypt.hash(password, this.saltOrRounds);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email,
          first_name,
          last_name,
          password: hash,
          phone: phone,
          user_type: UserType.VISITOR,
        },
      });

      return await this.generateToken({
        id: user.id,
        email,
      });
    } catch (error) {
      throw new InternalServerErrorException('Server failed to process data');
    }
  }

  async login({ email, password }: LoginParams) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) throw new NotFoundException();

    const hashedPassword = user.password;
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) throw new UnauthorizedException();

    const token = await this.generateToken({ id: user.id, email: email });
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      email: email,
      phone: user.phone,
      ...token,
    };
  }

  private async generateToken(user: { id: number; email: string }) {
    const token = await jwt.sign(user, process.env.ACCESS_TOKEN, {
      expiresIn: 3600,
    });
    return { token };
  }
}
