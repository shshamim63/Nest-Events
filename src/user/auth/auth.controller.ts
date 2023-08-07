import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Login, LoginDto, SignUp, SignupDto } from '../user.dto';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ConflictResponse,
  InternalServerErrorResponse,
  InvalidRequestBodyErrorResponse,
  NotFoundResponse,
  UnauthorizedResponse,
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

  @ApiNotFoundResponse({
    description: 'User does not exist with the email',
    type: NotFoundResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'When password is invalid',
    type: UnauthorizedResponse,
  })
  @ApiOkResponse({
    description: 'Successfully logged in',
    type: Login,
  })
  @HttpCode(200)
  @Post('/login')
  login(@Body() body: LoginDto): Promise<Login> {
    return this.authService.login(body);
  }
}
