import { Body, Controller, Post } from "@nestjs/common";
import { apiResponse } from "src/helpers/response.helper";
import { AuthService } from "src/services/auth.service";
import { TokenService } from "src/services/token.service";

export class LoginCredentials {
  username: string;
  password: string;
}
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) { }
  // Đăng nhập
  @Post('login')
  async login(@Body() credentials: LoginCredentials) {
    const session = await this.authService.check(credentials);
    const response = {
      accessToken: this.tokenService.createAccessToken(session.user),
      refreshToken: session.refreshToken,
      ...this.tokenService.secureUserData(session.user),
    };
    return apiResponse('Đăng nhập thành công', response);
  }
}