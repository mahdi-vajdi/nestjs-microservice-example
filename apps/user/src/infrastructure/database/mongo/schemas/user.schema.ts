import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../../../domain/entities/user.entity';

export type UserDocument = HydratedDocument<UserModel>;

@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class UserModel {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  mobile: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ required: false, default: null })
  deletedAt?: Date;

  // Auto generated fields
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;

  static fromDomain(user: User): UserModel {
    if (!user) return null;

    const userModel = new UserModel();

    userModel.email = user.email;
    userModel.mobile = user.mobile;
    userModel.firstName = user.firstName;
    userModel.lastName = user.lastName;
    userModel.avatar = user.avatar;
    userModel.deletedAt = user.deletedAt;

    return userModel;
  }

  static toDomain(userModel: UserModel): User {
    if (!userModel) return null;

    return new User({
      id: userModel._id.toHexString(),
      email: userModel.email,
      mobile: userModel.mobile,
      firstName: userModel.firstName,
      lastName: userModel.lastName,
      avatar: userModel.avatar,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt,
      deletedAt: userModel.deletedAt,
    });
  }
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
