
import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      role: 'employee',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      role: 'boss',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
  // Sửa đổi lại id thành string
  async getProductivity(id:number) : Promise<User | undefined>{
    return this.users.find(user => user.userId === id);
  }
}
