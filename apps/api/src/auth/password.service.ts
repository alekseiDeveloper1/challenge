import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async comparePasswords(
    plainPassword: string,  // "Сырой" пароль от пользователя
    hashedPassword: string // Хеш из базы данных
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}