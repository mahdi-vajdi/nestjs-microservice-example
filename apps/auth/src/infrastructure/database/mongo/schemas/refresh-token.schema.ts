import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RefreshToken } from '../../../../domain/entities/refresh-token.entity';

export type RefreshTokenDocument = HydratedDocument<RefreshTokenModel>;

@Schema({ collection: 'refresh_tokens', timestamps: true, versionKey: false })
export class RefreshTokenModel {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  identifier: string;

  @Prop({ required: false, default: null })
  deletedAt?: Date;

  // Auto generated fields
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;

  static fromDomain(refreshToken: RefreshToken): RefreshTokenModel {
    const refreshTokenModel = new RefreshTokenModel();

    refreshTokenModel.userId = refreshToken.userId;
    refreshTokenModel.identifier = refreshToken.identifier;

    return refreshTokenModel;
  }

  static toDomain(refreshTokenModel: RefreshTokenModel): RefreshToken {
    const refreshToken = new RefreshToken();

    refreshToken.id = refreshTokenModel._id.toHexString();
    refreshToken.userId = refreshTokenModel.userId;
    refreshToken.identifier = refreshTokenModel.identifier;
    refreshToken.createdAt = refreshTokenModel.createdAt;
    refreshToken.updatedAt = refreshTokenModel.updatedAt;
    refreshToken.deletedAt = refreshTokenModel.deletedAt;

    return refreshToken;
  }
}

export const RefreshTokenSchema =
  SchemaFactory.createForClass(RefreshTokenModel);
