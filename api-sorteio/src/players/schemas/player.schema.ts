import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Player extends Document {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  forca: number;

  @Prop({ required: true })
  velocidade: number;

  @Prop({ required: true })
  passe: number;

  @Prop({ required: true })
  chute: number;

  @Prop({ required: true })
  corpo: number;

  @Prop({ required: true })
  esperteza: number;

  @Prop({ required: true })
  userId: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
