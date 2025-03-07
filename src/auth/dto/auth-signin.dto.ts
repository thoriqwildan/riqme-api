import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'havespace', type: String })
  emailOrUsername: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '12345678', type: String })
  password: string;
}
