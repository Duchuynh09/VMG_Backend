// src/worker/worker.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import * as dayjs from 'dayjs';
// This should be a real class/interface representing a user entity
import { WorkerProfile } from './schemas/worker.schema';
import { Operation } from 'src/worker/schemas/operation.shema';
import { User } from 'src/auth/schemas/user.schema';
import { UpdateProductivityDto } from './dto/worker.dto';

@Injectable()
export class WorkerService {
  // Sử dụng mongoose để lấy user từ database
  // @InjectModel('user') private userModel: Model<User>;
  constructor(
    @InjectModel(WorkerProfile.name) private workerModel: Model<WorkerProfile>,
    @InjectModel(Operation.name) private operationModel: Model<Operation>,
    @InjectModel(User.name) private userModel: Model<User>
  ) { }

  async getAll() {
    return this.workerModel.find().exec()
  }
  // Khởi tạo một user mới
  async createEmployee(data: {
    username: string;
    email: string;
    password: string;
    teamId?: string;
    role?: string;
  }): Promise<WorkerProfile> {
    const existingUser = await this.workerModel.findOne({ username: data.username }).exec();
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }
    // Băm password trước khi lưu vào database
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new this.workerModel({
      ...data,
      password: hashedPassword,
      role: data.role || 'employee',
      productivity: {},
      workingHours: [],
    });
    return user.save();
  }
  // Tìm theo tên 
  async findByUsername(username: string): Promise<WorkerProfile | null> {
    return this.workerModel.findOne({ username }).exec();
  }
  // Tìm theo id 
  async findByUserid(id: string): Promise<WorkerProfile | null> {
    return this.workerModel.findById(id).exec();
  }
  // Cập nhật user
  async updateEmployee(id: string, data: {
    cccd?: string
    username?: string;
    email?: string;
    teamId?: string;
  }): Promise<WorkerProfile> {
    const user = await this.workerModel.findById(id).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const updatedUser = await this.workerModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
    if (!updatedUser) {
      throw new BadRequestException('User not found after update');
    }
    return updatedUser;
  }
  // Xóa user

  async deleteEmployee(id: string): Promise<void> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.workerModel.deleteOne({ user: id });
    await this.userModel.deleteOne({ _id: id });
  }

  async updateProfileByUser(data: {
    fullName: string,
    birthDay?: Date,
    cccd?: string,
    phone?: string,
    address?: string
    user: string
  }) {
    const user = this.workerModel.findOneAndUpdate(
      data
      ,
      {},
      {
        returnDocument: "after", upsert: true
      }
    )
    return user
  }
  // CHƯA ĐỌC LẠI
  // Chỉnh sửa nhật ký sản lượng 
  async updateProductivity(
    workerId: string,
    dto: UpdateProductivityDto,
  ): Promise<{ message: string }> {
    const worker = await this.workerModel.findById(workerId);
    if (!worker) {
      throw new NotFoundException('Không tìm thấy công nhân');
    }

    const existingIndex = worker.productivity.findIndex(
      (entry) =>
        entry.date === dto.date &&
        entry.productCode === dto.productCode &&
        entry.operationId === dto.operationId,
    );

    if (existingIndex >= 0) {
      // Cập nhật sản lượng
      worker.productivity[existingIndex].amount = dto.amount;
      if (dto.isPrimary !== undefined) {
        worker.productivity[existingIndex].isPrimary = dto.isPrimary;
      }
    } else {
      // Thêm mới nếu chưa có
      worker.productivity.push({
        date: dto.date,
        productCode: dto.productCode,
        operationId: dto.operationId,
        amount: dto.amount,
        isPrimary: dto.isPrimary ?? true,
      });
    }

    await worker.save();
    return { message: 'Cập nhật sản lượng thành công' };
  }
  // Chưa đọc
  async getMonthlySalary(workerId: string, month: string) {
    const worker = await this.workerModel.findById(workerId).lean();
    if (!worker) throw new NotFoundException('Worker not found');

    const monthStart = dayjs(`${month}-01`);
    const monthEnd = monthStart.endOf('month');

    const operations = await this.operationModel.find().lean();

    const logs = worker.productivity.filter((log) => {
      const date = dayjs(log.date);
      return date.isAfter(monthStart.subtract(1, 'day')) && date.isBefore(monthEnd.add(1, 'day'));
    });

    let total = 0;
    const detail: Array<{
      date: string;
      productCode: string;
      operationName: string;
      unitPrice: number;
      amount: number;
      total: number;
      support: boolean;
    }> = [];

    for (const log of logs) {
      const operation = operations.find(
        (op) =>
          op._id.toString() === log.operationId &&
          op.productCode === log.productCode,
      );

      if (!operation) continue;

      const isSupport =
        log.isPrimary === false ||
        operation.team !== worker.teamId;

      const unitPrice = operation.unitPrice * (isSupport ? 1.2 : 1);

      const amount = log.amount * unitPrice;
      total += amount;

      detail.push({
        date: log.date,
        productCode: log.productCode,
        operationName: operation.name,
        unitPrice,
        amount: log.amount,
        total: amount,
        support: isSupport,
      });
    }

    return {
      workerName: worker.fullName,
      totalSalary: total,
      details: detail,
    };
  }
}
