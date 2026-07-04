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

const encryptField = (v: string): string => {
  if (!v) return '';
  try { return encryptionService.encrypt(v) || ''; } catch { return v; }
};

const decryptField = (v: string): string => {
  if (!v) return '';
  try { return encryptionService.decrypt(v) || ''; } catch { return v; }
};

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
      enum: {
        values: ['employee', 'admin', 'super_admin'],
        message: 'Role must be employee, admin, or super_admin',
      },
      default: 'employee',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    loginAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
    personalDetails: {
      fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters'],
      },
      phone: {
        type: String,
        default: '',
        set: encryptField,
        get: decryptField,
      },
      address: {
        type: String,
        default: '',
        set: encryptField,
        get: decryptField,
      },
      profilePicture: {
        publicId: { type: String, default: '' },
        secureUrl: { type: String, default: '' },
        thumbnailUrl: { type: String, default: '' },
      },
    },
    jobDetails: {
      position: {
        type: String,
        required: [true, 'Position is required'],
        trim: true,
      },
      department: {
        type: String,
        required: [true, 'Department is required'],
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
      },
      allowances: {
        type: Number,
        default: 0,
        min: 0,
      },
      deductions: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
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

// ============================================================
// VIRTUALS
// ============================================================
userSchema.virtual('netSalary').get(function (this: IUser) {
  const base = this.salaryStructure?.base || 0;
  const allowances = this.salaryStructure?.allowances || 0;
  const deductions = this.salaryStructure?.deductions || 0;
  return base + allowances - deductions;
});

userSchema.virtual('fullName').get(function (this: IUser) {
  return this.personalDetails?.fullName || '';
});

// ============================================================
// PRE-SAVE MIDDLEWARE
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
  return this.lockedUntil.getTime() > Date.now();
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

userSchema.statics.findActiveUsers = function () {
  return this.find({ isActive: true }).select('-password -loginAttempts');
};

userSchema.statics.findByDepartment = function (department: string) {
  return this.find({
    'jobDetails.department': department,
    isActive: true,
  }).select('-password');
};

// ============================================================
// QUERY MIDDLEWARE
// ============================================================
userSchema.pre(/^find/, function (this: mongoose.Query<any, IUser>, next) {
  this.find({ isActive: { $ne: false } });
  next();
});

export const User = mongoose.model<IUser>('User', userSchema);
export default User;