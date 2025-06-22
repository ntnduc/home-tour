import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from 'src/common/decorators/allow-anonymous.decorator';
import { AuthService } from './auth.service';
import { RequestRefreshToken, RequestRegister } from './dto/auth.dto';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @AllowAnonymous()
  async requestSendOTP(@Body() body: { phoneNumber: string }) {
    return this.authService.requestSendOTP(body.phoneNumber);
  }

  @Post('verify-otp')
  @AllowAnonymous()
  async verifyOTP(@Body() body: { phoneNumber: string; code: string }) {
    return this.authService.verifyOTP(body.phoneNumber, body.code);
  }

  @UseGuards(AuthGuard('jwt-temp'))
  @Post('register')
  @AllowAnonymous()
  async register(@Request() req: any, @Body() body: RequestRegister) {
    const { phone } = req.user;
    return this.authService.register(body.name, phone);
  }

  @Post('refresh-token')
  @AllowAnonymous()
  async refreshToken(@Body() body: RequestRefreshToken) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Get('check-login')
  async checkLogin(@Request() req: any) {
    return {
      isLoggedIn: true,
    };
  }
}
