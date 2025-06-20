import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }
  @Get('/')
  async getAll() {
    return this.userService.getAll()
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    // Trả về yêu cầu chưa trả về res
    return req.user;
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Manager)
  @Get('team-productivity')
  async getTeamProductivity(@Request() req) {
    return this.userService.getTeamProductivity(req.user.teamId);
  }

  /*
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('all-productivity')
  async getAllProductivityForDate() {
    return this.userService.getAllProductivity(); // lấy sản lượng của tất cả user
  }
  @UseGuards(JwtAuthGuard)
  @Get('productivity/:id')
  // sửa đổi id thành string
  async getProductivity(@Param() id: number) {
    return this.userService.getProductivity(id);
  }
  */
}

