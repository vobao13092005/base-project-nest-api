
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { apiAuthError, AUTH_ERRORS } from 'src/helpers/response.helper';
import { UserService } from 'src/services/database/user.service';
import { TokenService } from 'src/services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) {
      throw apiAuthError(AUTH_ERRORS.BLANK_TOKEN);
    }
    try {
      const payload = this.tokenService.decodeAccessToken(accessToken);
      const user = await this.userService.findByField({ userId: payload.userId });
      await user?.roles.load();
      request.user = user;
      return true;
    } catch (exception) {
      throw apiAuthError(exception);
    }
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
