/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/auth-signup.dto';
import { SignInDto } from './dto/auth-signin.dto';
import { Request } from 'express';
import { JwtRoleGuard } from 'src/config/guards/jwtrole.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() signupDto: SignUpDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signUp(signupDto);
  }

  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh-token')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-refresh'))
  async refreshToken(
    @Req() req: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    console.log(req.user!['sub']);
    return this.authService.refresh(req.user!['sub']);
  }

  @Delete('signout')
  @ApiBearerAuth()
  @UseGuards(JwtRoleGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(@Req() req: Request) {
    return this.authService.signOut(req.user!['sub']);
  }
}
