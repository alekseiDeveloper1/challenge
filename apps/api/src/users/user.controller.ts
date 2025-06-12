import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus, Param,
  Post, UseGuards, Request
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller()
export class UserController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req:any) {
    return this.usersService.findOne(req);
  }
}
