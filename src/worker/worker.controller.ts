import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WorkerService } from './woker.service';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { UpdateWorkerProfileDto } from './dto/worker.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly workerService: WorkerService) { }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('/')
  async getAll() {
    return this.workerService.getAll()
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProfile(@Param() param: any) {
    // Trả về yêu cầu chưa trả về res
    return this.workerService.findByUserid(param.id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.HR)
  @Delete(':id')
  async delete(@Param() param: any) {
    return this.workerService.deleteEmployee(param.id)
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.HR)
  @Patch(':id')
  async upadte(@Param() param: any, @Request() req) {
    return this.workerService.updateEmployee(param.id, req.user)
  }
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(@Body() dto: UpdateWorkerProfileDto) {
    return this.workerService.updateProfileByUser(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':workerId/salary')
  getSalary(@Param('workerId') id: string, @Query('month') month: string) {
    return this.workerService.getMonthlySalary(id, month);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Accounting)
  @Put(':workerId/productivity')
  updateProductivity(
    @Param('workerId') workerId: string,
    @Body() dto: UpdateProductivityDto,
  ) {
    return this.workerService.updateProductivity(workerId, dto);
  }
}

