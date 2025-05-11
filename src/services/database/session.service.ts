import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Session } from "src/entities/session.entity";
import { apiAuthError, AUTH_ERRORS } from "src/helpers/response.helper";

@Injectable()
export class SessionService {
  constructor(
    private readonly entityManager: EntityManager
  ) { }
  async findByRefreshToken(refreshToken: string): Promise<Session> {
    const session = await this.entityManager.findOne(Session, {
      refreshToken: refreshToken,
    }, {
      populate: ['user']
    });
    if (null === session) {
      throw apiAuthError(AUTH_ERRORS.SESSION_EXPIRED);
    }
    return session;
  }
  async deleteSession(refreshToken: string): Promise<void> {
    const session = await this.entityManager.findOne(Session, {
      refreshToken: refreshToken
    });
    if (null === session) {
      throw apiAuthError(AUTH_ERRORS.SESSION_EXPIRED);
    }
    await this.entityManager.removeAndFlush(session);
  }
}