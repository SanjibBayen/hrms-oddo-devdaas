import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
// import databaseManager from '../config/database';
import { encryptionService } from '../utils/encryption';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  employeeId: string;
  email: string;
  password: string;
  role: 'employee' | 'admin' | 'super_admin';
  isActive: boolean;
  loginAttempts: number;
  lockedUntil: Date | null;
  personalDetails: {
    fullName: string;
    phone: string;
    address: string;
    profilePicture: {
      publicId: string;
      secureUrl: string;
      thumbnailUrl: string;
    };
  };
  jobDetails: {
    position: string;
    department: string;
    joiningDate: Date;
    employmentType: 'full-time' | 'part-time' | 'contract';
  };
  salaryStructure: {
    base: number;
    allowances: number;
    deductions: number;
  };
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const userSchema = new Schema<IUser>(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      validate: {
        validator: (v: string) => /^EMP\d{4}$/.test(v),
        message: 'Employee ID must be EMP followed by 4 digits',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['employee', 'admin', 'super_admin'],
      default: 'employee',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
    personalDetails: {
      fullName: { type: String, required: true, trim: true },
      phone: {
        type: String,
        set: (v: string) => (v ? encryptionService.encrypt(v) : v),
        get: (v: string) => (v ? encryptionService.decrypt(v) : v),
      },
      address: {
        type: String,
        set: (v: string) => (v ? encryptionService.encrypt(v) : v),
        get: (v: string) => (v ? encryptionService.decrypt(v) : v),
      },
      profilePicture: {
        publicId: String,
        secureUrl: String,
        thumbnailUrl: String,
      },
    },
    jobDetails: {
      position: { type: String, required: true },
      department: { type: String, required: true },
      joiningDate: { type: Date, default: Date.now },
      employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract'],
        default: 'full-time',
      },
    },
    salaryStructure: {
      base: {
        type: Number,
        default: 0,
        set: (v: number) => parseFloat(encryptionService.encrypt(v.toString()) || '0'),
        get: (v: number) => parseFloat(encryptionService.decrypt(v?.toString()) || '0'),
      },
      allowances: {
        type: Number,
        default: 0,
        set: (v: number) => parseFloat(encryptionService.encrypt(v.toString()) || '0'),
        get: (v: number) => parseFloat(encryptionService.decrypt(v?.toString()) || '0'),
      },
      deductions: {
        type: Number,
        default: 0,
        set: (v: number) => parseFloat(encryptionService.encrypt(v.toString()) || '0'),
        get: (v: number) => parseFloat(encryptionService.decrypt(v?.toString()) || '0'),
      },
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// INDEXES - No duplicates
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ 'jobDetails.department': 1 });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if locked
userSchema.methods.isLocked = function (): boolean {
  if (!this.lockedUntil) return false;
  return this.lockedUntil > new Date();
};

// Increment login attempts
userSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
  }
  await this.save({ validateBeforeSave: false });
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  this.loginAttempts = 0;
  this.lockedUntil = null;
  await this.save({ validateBeforeSave: false });
};

export const User = mongoose.model<IUser>('User', userSchema);
export default User;