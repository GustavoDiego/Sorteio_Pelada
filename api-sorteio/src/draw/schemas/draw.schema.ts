import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Draw extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [String], default: [] })
  players: string[];

  @Prop({ type: [[String]], default: [] })
  teams: string[][];
}

export const DrawSchema = SchemaFactory.createForClass(Draw);
