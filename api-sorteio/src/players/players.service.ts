import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Player, PlayerSchema } from './schemas/player.schema';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  private getModel(userId: string): Model<Player> {
    return this.connection.model(`jogadores_${userId}`, PlayerSchema, `jogadores_${userId}`);
  }

  async create(userId: string, dto: CreatePlayerDto) {
    const model = this.getModel(userId);
    const player = new model({ ...dto, userId });
    return player.save();
  }

  async findAll(userId: string) {
    const model = this.getModel(userId);
    return model.find().exec();
  }

  async findById(userId: string, id: string) {
    const model = this.getModel(userId);
    return model.findById(id).exec();
  }

  async update(userId: string, id: string, dto: UpdatePlayerDto) {
    const model = this.getModel(userId);
    return model.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async remove(userId: string, id: string) {
    const model = this.getModel(userId);
    return model.findByIdAndDelete(id).exec();
  }
}
