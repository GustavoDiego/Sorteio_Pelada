import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Player extends Document {
  @Prop({ required: true })
  Nome: string;

  @Prop({ required: true })
  Força: number;

  @Prop({ required: true })
  Velocidade: number;

  @Prop({ required: true })
  Passe: number;

  @Prop({ required: true })
  Chute: number;

  @Prop({ required: true })
  Corpo: number;

  @Prop({ required: true })
  Esperteza: number;

  @Prop({ required: true })
  userId: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
