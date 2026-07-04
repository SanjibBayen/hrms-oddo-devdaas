import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
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
  refreshTokenHash: string;
  deviceFingerprints: Array<{
    fingerprint: string;
    userAgent: string;
    ipAddress: string;
    lastUsed: Date;
  }>;
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
  emailVerificationToken: string;
  emailVerified: boolean;
  passwordResetToken: string;
  passwordResetExpires: Date;
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
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      validate: {
        validator: (v: string) => /^EMP\d{4}$/.test(v),
        message: 'Employee ID must be EMP followed by 4 digits (e.g., EMP0001)',
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
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
    refreshTokenHash: {
      type: String,
      select: false,
    },
    deviceFingerprints: [
      {
        fingerprint: String,
        userAgent: String,
        ipAddress: String,
        lastUsed: Date,
      },
    ],
    personalDetails: {
      fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
      },
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
      position: {
        type: String,
        required: true,
        trim: true,
      },
      department: {
        type: String,
        required: true,
        trim: true,
      },
      joiningDate: {
        type: Date,
        default: Date.now,
      },
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
        min: 0,
        set: (v: number) => parseFloat(encryptionService.encrypt(v.toString()) || '0'),
        get: (v: number) => parseFloat(encryptionService.decrypt(v?.toString()) || '0'),
      },
      allowances: {
        type: Number,
        default: 0,
        min: 0,
        set: (v: number) => parseFloat(encryptionService.encrypt(v.toString()) || '0'),
        get: (v: number) => parseFloat(encryptionService.decrypt(v?.toString()) || '0'),
      },
      deductions: {
        type: Number,
        default: 0,
        min: 0,
        set: (v: number) => parseFloat(encryptionService.encrypt(v.toString()) || '0'),
        get: (v: number) => parseFloat(encryptionService.decrypt(v?.toString()) || '0'),
      },
    },
    emailVerificationToken: String,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

// ============================================================
// INDEXES
// ============================================================

userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ 'jobDetails.department': 1, role: 1 });
userSchema.index({ employeeId: 1 });

// ============================================================
// PRE-SAVE HOOKS
// ============================================================

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// ============================================================
// INSTANCE METHODS
// ============================================================

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isLocked = function (): boolean {
  if (!this.lockedUntil) return false;
  return this.lockedUntil > new Date();
};

userSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  this.loginAttempts += 1;

  if (this.loginAttempts >= 5) {
    this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
  }

  await this.save({ validateBeforeSave: false });
};

userSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  this.loginAttempts = 0;
  this.lockedUntil = null;
  await this.save({ validateBeforeSave: false });
};

// ============================================================
// STATIC METHODS
// ============================================================

userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase(), isActive: true }).select('+password');
};

userSchema.statics.findByEmployeeId = function (employeeId: string) {
  return this.findOne({ employeeId: employeeId.toUpperCase(), isActive: true });
};

// ============================================================
// VIRTUALS
// ============================================================

userSchema.virtual('fullName').get(function (this: IUser) {
  return this.personalDetails?.fullName;
});

userSchema.virtual('netSalary').get(function (this: IUser) {
  const base = this.salaryStructure?.base || 0;
  const allowances = this.salaryStructure?.allowances || 0;
  const deductions = this.salaryStructure?.deductions || 0;
  return base + allowances - deductions;
});

export const User = mongoose.model<IUser>('User', userSchema);
export default User;