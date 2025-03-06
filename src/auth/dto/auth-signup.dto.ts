/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'havespace' })
  username: string;

  @IsOptional()
  @ApiProperty({ example: 'John', required: false })
  name?: string;

  @IsNotEmpty()
  @Min(3)
  @Max(10)
  @ApiProperty({ example: '12345678', minLength: 3, maxLength: 10 })
  password: string;

  @IsNotEmpty()
  @Matches('password')
  @ApiProperty({ example: '12345678', minLength: 3, maxLength: 10 })
  confirm_password: string;
}
