import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { apiResponse } from "src/helpers/response.helper";
import { SessionService } from "src/services/database/session.service";
import { TokenService } from "src/services/token.service";

@Controller('tokens')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService
  ) { }
  // Lấy access token mới bằng refresh token
  @Post('requestAccessToken')
  async resetAccessToken(@Body() body: { refreshToken: string; }) {
    const session = await this.sessionService.findByRefreshToken(body.refreshToken);
    const response = {
      accessToken: this.tokenService.createAccessToken(session.user),
    };
    return apiResponse('OK', response);
  }

  // Xác minh refresh token có hợp lệ không
  @Post('verifySession')
  async verifySession(@Body() body: { refreshToken: string; }) {
    const session = await this.sessionService.findByRefreshToken(body.refreshToken);
    this.tokenService.decodeRefreshToken(session.refreshToken);
    return apiResponse('OK', session.user);
  }

  // Xoá refresh token = Xoá session
  @Delete()
  async deleteSession(@Body() body: { refreshToken: string; }) {
    await this.sessionService.deleteSession(body.refreshToken);
  }
}