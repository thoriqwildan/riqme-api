import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule as CM } from '@nestjs/config';

@Module({
  imports: [ConfigModule, AuthModule, CM.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule {}
