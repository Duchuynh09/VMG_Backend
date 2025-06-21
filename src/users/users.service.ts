
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
// This should be a real class/interface representing a user entity
import { User } from './schemas/user.schema';
import { Operation } from 'src/operations/schemas/operation.shema';
@Injectable()
export class UsersService {
  // Sử dụng mongoose để lấy user từ database
  // @InjectModel('user') private userModel: Model<User>;
  constructor(@InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Operation.name) private operationModel: Model<Operation>,
  ) { }

  async getAll() {
    return this.userModel.find().exec()
  }
  // Khởi tạo một user mới
  async createEmployee(data: {
    username: string;
    email: string;
    password: string;
    teamId?: string;
    role?: string;
  }): Promise<User> {
    const existingUser = await this.userModel.findOne({ username: data.username }).exec();
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }
    // Băm password trước khi lưu vào database
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new this.userModel({
      ...data,
      password: hashedPassword,
      role: data.role || 'employee',
      productivity: {},
      workingHours: [],
    });
    return user.save();
  }
  // Tìm theo tên 
  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }
  // Cập nhật user
  async updateEmployee(id: string, data: {
    username?: string;
    email?: string;
    teamId?: string;
  }): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.role !== 'employee') {
      throw new BadRequestException('Can only update employees');
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
    if (!updatedUser) {
      throw new BadRequestException('User not found after update');
    }
    return updatedUser;
  }
  // Xóa user
  async deleteEmployee(id: string): Promise<void> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.role !== 'employee') {
      throw new BadRequestException('Can only delete employees');
    }
    await this.userModel.findByIdAndDelete(id).exec();
  }
  // Cập nhật sản lượng 
  async updateProductivity(userId: string, date: string, amount: number): Promise<User> {
    const updatedUser = await this.userModel
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
  ): Promise<User> {
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


  /*
  // ======Chưa sử dụng mongoose
  // Bằng tên nhưng chưa sử dụng mongoose
  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
  // === lấy sản lượng ===
  // Sửa đổi lại id thành string
  async getProductivity(id: number): Promise<User | undefined> {
    return this.users.find(user => user.userId === id);
  }
  async getAllProductivity(): Promise<any> {

    return this.users.map((user) => ({
      username: user.username,
      productivity: user.productivity,
    }));
  }
  async getTeamProductivity(teamId: string): Promise<any> {
    const users = this.users.filter(user => user.teamId === teamId);
    return users.map((user) => ({
      username: user.username,
      productivity: user.productivity,
    }));
  }
    */
}
