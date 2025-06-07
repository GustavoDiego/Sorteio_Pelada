import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(dto: CreateUserDto) {
    const createdUser = new this.userModel(dto);
    return createdUser.save();
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async findById(id: string) {
    return this.userModel.findById(id).select('-password');
  }
}
