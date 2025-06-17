import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    // Trả về yêu cầu chưa trả về res
    return req.user;
  }
  @UseGuards(JwtAuthGuard)
  @Get('productivity/:id')
  // sửa đổi id thành string
  async getProductivity(@Param() id: number) {
    return this.userService.getProductivity(id);
  }
}

