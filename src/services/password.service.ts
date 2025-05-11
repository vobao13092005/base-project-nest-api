import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordService {
  constructor() {}
  encrypt(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
  verify(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}