import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { SignUpDto } from './dto/auth-signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/auth-signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private logger = new Logger(AuthService.name);

  async signUp(
    signupDto: SignUpDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userAndEmail = await this.prismaService.user.count({
      where: {
        OR: [{ email: signupDto.email }, { username: signupDto.username }],
      },
    });
    if (userAndEmail > 0) {
      throw new BadRequestException('Email or Username is already taken.');
    }
    signupDto.password = await bcrypt.hash(signupDto.password, 10);

    const data = await this.prismaService.user.create({
      data: {
        email: signupDto.email,
        username: signupDto.username,
        name: signupDto.name,
        password: signupDto.password,
      },
    });

    const payload = { sub: data.id, email: data.email, role: data.role };
    const token = await this.generateToken(payload);

    return token;
  }

  async signIn(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const data = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { email: signInDto.emailOrUsername },
          { username: signInDto.emailOrUsername },
        ],
      },
    });
    if (!data) {
      throw new BadRequestException('Invalid email or username');
    }
    const passwordCheck = await bcrypt.compare(
      signInDto.password,
      data.password,
    );
    if (!passwordCheck) {
      throw new BadRequestException('Invalid password');
    }
    const payload = { sub: data.id, email: data.email, role: data.role };
    const token = await this.generateToken(payload);

    return token;
  }

  async refresh(user_id: number) {
    const data = await this.prismaService.user.findFirst({
      where: { id: user_id },
    });
    if (!data) {
      throw new BadRequestException('Invalid user');
    }
    const payload = { sub: data.id, email: data.email, role: data.role };
    const token = await this.generateToken(payload);
    return token;
  }

  async signOut(user_id: number) {
    await this.prismaService.user.update({
      where: { id: user_id },
      data: { refresh_token: null },
    });
  }

  // Tools
  async generateToken(payload: {
    sub: number;
    email: string;
    role: string;
  }): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prismaService.user.update({
      where: { id: payload.sub },
      data: { refresh_token: hashedRefreshToken },
    });
    return { accessToken, refreshToken };
  }
}
