import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, SignUp, SignupDto } from '../user.dto';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ConflictResponse,
  InternalServerErrorResponse,
  InvalidRequestBodyErrorResponse,
} from 'src/models/common.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiCreatedResponse({
    description: 'Successfully registered user',
    type: SignUp,
  })
  @ApiBadRequestResponse({
    description: 'Successfully registered user',
    type: InvalidRequestBodyErrorResponse,
  })
  @ApiConflictResponse({
    description: 'User already exist',
    type: ConflictResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Successfully registered user',
    type: InternalServerErrorResponse,
  })
  signup(@Body() body: SignupDto): Promise<SignUp> {
    return this.authService.signup(body);
  }

  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
