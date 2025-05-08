import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Credential } from '../../../../domain/entities/credential.entity';

@Schema({ collection: 'auth_credentials', timestamps: true })
export class CredentialModel {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  // Auto generated fields
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(credential: Credential): CredentialModel {
    const credentialModel = new CredentialModel();

    credentialModel.userId = credential.userId;
    credentialModel.passwordHash = credential.passwordHash;

    return credentialModel;
  }

  static toDomain(credentialModel: CredentialModel): Credential {
    const credential = new Credential();

    credential.id = credentialModel._id.toHexString();
    credential.userId = credentialModel.userId;
    credential.passwordHash = credentialModel.passwordHash;
    credential.deletedAt = credentialModel.deletedAt;
    credential.createdAt = credentialModel.createdAt;
    credential.updatedAt = credentialModel.updatedAt;

    return credential;
  }
}

export const CredentialSchema = SchemaFactory.createForClass(CredentialModel);
