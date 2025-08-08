import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacModule } from '../rbac/rbac.module';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OTP } from './entities/OTP.entity';
import { Token } from './entities/token.entity';
import { JwtTempStrategy } from './strategies/jwt-temp.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, OTP, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule,
    UsersModule,
    RbacModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtTempStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
