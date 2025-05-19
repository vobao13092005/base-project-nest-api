import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { LoginCredentials } from "src/controllers/auth.controller";
import { User } from "src/entities/user.entity";
import { apiError } from "src/helpers/response.helper";
import { PasswordService } from "./password.service";
import { Session } from "src/entities/session.entity";
import { TokenService } from "./token.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) { }
  async check(credentials: LoginCredentials): Promise<Session> {
    const user = await this.entityManager.findOne(User, { username: credentials.username });
    if (null === user) {
      throw apiError('Thông tin đăng nhập không hợp lệ');
    }
    const check = this.passwordService.verify(credentials.password, user.password);
    if (false === check) {
      throw apiError('Mật khẩu không hợp lệ');
    }
    const session = new Session();
    session.refreshToken = this.tokenService.createRefreshToken(user);
    session.user = user;
    user.sessions.add(session);
    await this.entityManager.persistAndFlush(user);
    return session;
  }
}