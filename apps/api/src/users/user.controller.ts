import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus, Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  signIn(@Body() signInDto: Record<string, any>) {
    return this.usersService.createUser(signInDto.email, signInDto.password, signInDto.name);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
