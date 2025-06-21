
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
// This should be a real class/interface representing a user entity
import { WorkerProfile } from './schemas/worker.schema';
import { Operation } from 'src/operations/schemas/operation.shema';
@Injectable()
export class UsersService {
  // Sử dụng mongoose để lấy user từ database
  // @InjectModel('user') private userModel: Model<User>;
  constructor(@InjectModel(WorkerProfile.name) private workModel: Model<WorkerProfile>,
    @InjectModel(Operation.name) private operationModel: Model<Operation>,
  ) { }

  async getAll() {
    return this.workModel.find().exec()
  }
  // Khởi tạo một user mới
  async createEmployee(data: {
    username: string;
    email: string;
    password: string;
    teamId?: string;
    role?: string;
  }): Promise<WorkerProfile> {
    const existingUser = await this.workModel.findOne({ username: data.username }).exec();
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }
    // Băm password trước khi lưu vào database
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new this.workModel({
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
    return this.workModel.findOne({ username }).exec();
  }
  // Tìm theo id 
  async findByUserid(id: string): Promise<WorkerProfile | null> {
    return this.workModel.findById(id).exec();
  }
  // Cập nhật user
  async updateEmployee(id: string, data: {
    cccd?: string
    username?: string;
    email?: string;
    teamId?: string;
  }): Promise<WorkerProfile> {
    const user = await this.workModel.findById(id).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.role !== 'employee') {
      throw new BadRequestException('Can only update employees');
    }
    const updatedUser = await this.workModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
    if (!updatedUser) {
      throw new BadRequestException('User not found after update');
    }
    return updatedUser;
  }
  // Xóa user
  async deleteEmployee(id: string): Promise<void> {
    const user = await this.workModel.findById(id).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.role !== 'employee') {
      throw new BadRequestException('Can only delete employees');
    }
    await this.workModel.findByIdAndDelete(id).exec();
  }


  /*
  
    // Cập nhật sản lượng 
    async updateProductivity(userId: string, date: string, amount: number): Promise<WorkerProfile> {
      const updatedUser = await this.workModel
        .findByIdAndUpdate(
          userId,
          { $set: { [`productivity.${date}`]: amount } },
          { new: true },
        )
        .exec();
      if (!updatedUser) {
        throw new BadRequestException('User not found');
      }
      return updatedUser;
    }
    async updateWorkingHours(
      userId: string,
      date: string,
      startTime: string,
      endTime: string,
    ): Promise<WorkerProfile> {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new BadRequestException('User not found');
      }
      const workingHours = user.workingHours.filter((wh) => wh.date !== date);
      workingHours.push({ date, startTime, endTime });
      const updatedUser = await this.userModel
        .findByIdAndUpdate(userId, { $set: { workingHours } }, { new: true })
        .exec();
      if (!updatedUser) {
        throw new BadRequestException('User not found');
      }
      return updatedUser;
    }
    // ====Cập nhật sản lượng và thời gian làm việc hàng loạt===
    // Cập nhật sản lượng
    async bulkUpdateProductivity(updates: { userId: string; date: string; amount: number }[]) {
      const bulkOps = updates.map(({ userId, date, amount }) => ({
        updateOne: {
          filter: { _id: userId, role: 'employee' },
          update: { $set: { [`productivity.${date}`]: amount } },
        },
      }));
      return this.userModel.bulkWrite(bulkOps);
    }
    // Cập nhật thời gian làm việc
    async bulkUpdateWorkingHours(updates: { userId: string; date: string; startTime: string; endTime: string }[]) {
      const bulkOps = updates.map(({ userId, date, startTime, endTime }) => ({
        updateOne: {
          filter: { _id: userId, role: 'employee' },
          update: {
            $push: {
              workingHours: { $each: [{ date, startTime, endTime }], $slice: -30 }, // giữ tối đa 30 ngày
            },
          },
        },
      }));
      return this.userModel.bulkWrite(bulkOps);
    }
  
    async getProductivity(userId: string): Promise<any> {
      const user = await this.userModel.findById(userId).exec();
  
      return user ? user.productivity : {};
    }
  
    // Lấy sản lượng của team
    async getTeamProductivity(teamId: string): Promise<any> {
      const users = await this.userModel.find({ teamId, role: 'employee' }).exec();
      return users.map((user) => ({
        username: user.username,
        productivity: user.productivity,
        workingHours: user.workingHours,
      }));
    }
      */
}
