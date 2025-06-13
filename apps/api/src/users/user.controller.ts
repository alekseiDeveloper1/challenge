import {
  Controller,
  Get,
  Request
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UserController {
  constructor(private usersService: UsersService) {}

  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getProfile(@Request() req:any) {
    return this.usersService.findOne(req);
  }
}
