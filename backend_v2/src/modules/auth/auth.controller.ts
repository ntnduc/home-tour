import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestRegister } from './dto/auth.dto';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  async requestSendOTP(@Body() body: { phoneNumber: string }) {
    return this.authService.requestSendOTP(body.phoneNumber);
  }

  @Post('verify-otp')
  async verifyOTP(@Body() body: { phoneNumber: string; code: string }) {
    return this.authService.verifyOTP(body.phoneNumber, body.code);
  }

  @UseGuards(AuthGuard('jwt-temp'))
  @Post('register')
  async register(@Request() req: any, @Body() body: RequestRegister) {
    const { phone } = req.user;
    return this.authService.register(body.name, phone);
  }
}
