import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entities/user.entity";
import { AUTH_ERRORS } from "src/helpers/response.helper";

export type TokenType = 'rt' | 'at';

export type TokenPayload = {
  type: TokenType;
} & Partial<User>;

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService
  ) { }
  decodeToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: 'SussyBakaUwU',
    });
  }
  encodeToken(payload: any, expiresIn: string): string {
    return this.jwtService.sign(payload, {
      secret: 'SussyBakaUwU',
      expiresIn: expiresIn
    });
  }
  secureUserData(user: User): Partial<User> {
    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      avatar: user.avatar ?? "",
    };
  }
  createTokenPayload(user: User, type: TokenType): TokenPayload {
    return {
      ...this.secureUserData(user),
      type: type,
    };
  }
  createAccessToken(user: User): string {
    const accessTokenPayload: TokenPayload = this.createTokenPayload(user, 'at');
    return this.encodeToken(accessTokenPayload, '1h');
  }
  createRefreshToken(user: User): string {
    const refreshTokenPayload: TokenPayload = this.createTokenPayload(user, 'rt');
    return this.encodeToken(refreshTokenPayload, '1y');
  }
  decodeAccessToken(accessToken: string): TokenPayload {
    var data: TokenPayload;
    try {
      data = this.decodeToken(accessToken);
    } catch {
      // Token hết hạn hoặc không hợp lệ
      throw AUTH_ERRORS.INVALID_TOKEN;
    }
    if (data.type !== 'at') {
      // Không phải loại token mà hệ thống cần (Access token)
      throw AUTH_ERRORS.TOKEN_MISMATCH;
    }
    return data;
  }
  decodeRefreshToken(refreshToken: string): TokenPayload {
    var data: TokenPayload;
    try {
      data = this.decodeToken(refreshToken)
    } catch {
      throw AUTH_ERRORS.INVALID_TOKEN;
    }
    if (data.type !== 'rt') {
      throw AUTH_ERRORS.TOKEN_MISMATCH;
    }
    return data;
  }
}