import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshTokenModel>;

@Schema({ collection: 'refresh_tokens', timestamps: true, versionKey: false })
export class RefreshTokenModel {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  identifier: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: false, default: null })
  deletedAt?: Date;

  // Auto generated fields
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export const RefreshTokenSchema =
  SchemaFactory.createForClass(RefreshTokenModel);
