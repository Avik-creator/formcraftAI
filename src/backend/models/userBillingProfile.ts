import mongoose, { InferSchemaType } from 'mongoose';

const userBillingProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    polarCustomerId: { type: String, required: false, index: true },
    planId: { type: String, enum: ['free', 'proplan'], required: true, default: 'free' },
    isPro: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

export type UserBillingProfileModel = InferSchemaType<typeof userBillingProfileSchema>;

export const UserBillingProfile =
  mongoose.models?.UserBillingProfile ||
  mongoose.model<UserBillingProfileModel>('UserBillingProfile', userBillingProfileSchema);

export default UserBillingProfile as mongoose.Model<UserBillingProfileModel>;


