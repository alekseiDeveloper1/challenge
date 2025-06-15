import {
  Controller,
  Get,
  Request
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller()
export class UserController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get('/')
  checkHealth() {
    return 'Hello World!';
  }

  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getProfile(@Request() req:any) {
    return this.usersService.findOne(req);
  }
}
