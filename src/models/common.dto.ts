import { ApiProperty } from '@nestjs/swagger';

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

export class NotFoundResponse {
  @ApiProperty({
    example: 404,
  })
  statusCode: number;
  @ApiProperty({
    example: 'Not Found',
  })
  message: string;
}

export class InvalidRequestBodyErrorResponse {
  @ApiProperty({
    example: 400,
  })
  statusCode: number;
  @ApiProperty({
    example: ['<Property> must be a <Type>'],
  })
  message: string[];
  @ApiProperty({
    example: 'Bad Request',
  })
  error: string;
}

export class InternalServerErrorResponse {
  @ApiProperty({
    example: 500,
  })
  statusCode: number;
  @ApiProperty({
    example: 'Server failed to process data',
  })
  message: string;
  @ApiProperty({
    example: 'Internal Server Error',
  })
  error: string;
}

export class UnauthorizedResponse {
  @ApiProperty({
    example: 401,
  })
  statusCode: number;
  @ApiProperty({
    example: 'Unauthorized',
  })
  error: string;
}