import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  stack_user_id: string; // Stack Auth user ID
  email: string;
  display_name?: string;
  profile_image_url?: string;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
}

const UserSchema = new Schema<IUser>({
  stack_user_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  display_name: {
    type: String,
  },
  profile_image_url: {
    type: String,
  },
  last_login: {
    type: Date,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

const User = models.User || model<IUser>('User', UserSchema);

export default User;
