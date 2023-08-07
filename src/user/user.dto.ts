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

  @ApiProperty({
    description: 'Phone number of the user',
    type: String,
    example: '+01671451201',
  })
  @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
    message: 'Phone number is not valid',
  })
  @IsString()
  phone: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'Email Address',
    example: 'demo@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Valid password',
    example: 'example12@23',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

/*-------- Response DTO-----*/

export class SignUp {
  @ApiProperty()
  token: string;
}

export class Login {
  @ApiProperty({
    description: 'First name of the user',
    type: String,
    example: 'Demo',
  })
  first_name: string;

  @ApiProperty({
    description: 'Last name of the user',
    type: String,
    example: 'User',
  })
  last_name: string;

  @ApiProperty({
    description: 'Email of the user',
    type: String,
    example: 'demo@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Phone number of the user',
    type: String,
    example: '+01671451201',
  })
  phone: string;

  @ApiProperty({
    description: 'JWT Token',
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9........',
  })
  token: string;
}
