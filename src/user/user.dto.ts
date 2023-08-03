import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    description: 'First name of the user',
    type: String,
    example: 'Demo',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Last name of the user',
    type: String,
    example: 'User',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: 'Email of the user',
    type: String,
    example: 'demo@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    type: String,
    example: 'Demo_user12@34',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
    message: 'Phone number is not valid',
  })
  phone: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

/*-------- Response DTO-----*/

export class SignUp {
  @ApiProperty()
  token: string;
}

export class ConflictResponse {
  @ApiProperty({
    example: 409,
  })
  statusCode: number;
  @ApiProperty({
    example: 'Conflict',
  })
  message: string;
}
