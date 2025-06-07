import { Module } from '@nestjs/common';
import { DrawController } from './draw.controller';
import { DrawService } from './draw.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Draw, DrawSchema } from './schemas/draw.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Draw.name, schema: DrawSchema }])],
  controllers: [DrawController],
  providers: [DrawService],
  exports: [DrawService],
})
export class DrawModule {}
