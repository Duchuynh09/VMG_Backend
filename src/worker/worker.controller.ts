import { Controller, Delete, Get, Param, Patch, Put, Query, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './woker.service';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('/')
  async getAll() {
    return this.usersService.getAll()
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProfile(@Param() param: any) {
    // Trả về yêu cầu chưa trả về res
    return this.usersService.findByUserid(param.id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.HR)
  @Delete(':id')
  async delete(@Param() param: any) {
    return this.usersService.deleteEmployee(param.id)
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.HR)
  @Patch(':id')
  async upadte(@Param() param: any, @Request() req) {
    return this.usersService.updateEmployee(param.id, req.user)
  }
}

