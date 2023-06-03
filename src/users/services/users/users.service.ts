import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model } from 'mongoose';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { UserClass } from '../../schemas/User.schema';
import * as bcrypt from 'bcrypt';

import { User, SerializedUser } from '../../types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserClass.name) private readonly userModel: Model<UserClass>,
  ) {}

  async findByUsername(username: string) {
    return await this.userModel.findOne({ username }).exec();
  }

  async findById(userId: string) {
    return await this.userModel.findById(userId).exec();
  }

  async deleteUserById(userId: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(userId).exec();
    if (!deletedUser) throw new NotFoundException('User not found');
    return deletedUser;
  }

  async createUser(user: User) {
    const userExists = await this.userModel
      .findOne({ username: user.username })
      .exec();
    if (userExists) throw new Error('User already exists');
    user.password = await bcrypt.hash(user.password, 10);
    return await this.userModel.create(user);
  }

  async updateUser(userId: string, payload: Partial<User>) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      payload,
      { new: true },
    );

    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }
}
