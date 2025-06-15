import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestRegister } from './dto/auth.dto';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-send-otp')
  async requestSendOTP(@Body() body: { phoneNumber: string }) {
    return this.authService.requestSendOTP(body.phoneNumber);
  }

  @Post('verify-otp')
  async verifyOTP(@Body() body: { phoneNumber: string; code: string }) {
    return this.authService.verifyOTP(body.phoneNumber, body.code);
  }

  @Post('register')
  async register(@Body() body: RequestRegister) {}
}
