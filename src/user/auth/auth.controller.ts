import { Body, Controller, Post } from '@nestjs/common';
import { ConflictResponse, LoginDto, SignUp, SignupDto } from '../user.dto';
import { AuthService } from './auth.service';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiCreatedResponse({
    description: 'Successfully registered user',
    type: SignUp,
  })
  @ApiConflictResponse({
    description: 'User already exist',
    type: ConflictResponse,
  })
  signup(@Body() body: SignupDto): Promise<SignUp> {
    return this.authService.signup(body);
  }

  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
