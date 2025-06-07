import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
