import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Player extends Document {
  @Prop({ required: true, trim: true })
  nome: string;

  @Prop({ required: true, min: 0, max: 5 })
  forca: number;

  @Prop({ required: true, min: 0, max: 5 })
  velocidade: number;

  @Prop({ required: true, min: 0, max: 5 })
  passe: number;

  @Prop({ required: true, min: 0, max: 5 })
  chute: number;

  @Prop({ required: true, min: 0, max: 5 })
  corpo: number;

  @Prop({ required: true, min: 0, max: 5 })
  esperteza: number;

  @Prop({ required: true })
  userId: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
