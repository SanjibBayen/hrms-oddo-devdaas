import mongoose, { Schema, Document } from 'mongoose';
import { encryptionService } from '../utils/encryption';

export interface IPayroll extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  grossPay: number;
  netPay: number;
  basicPay: number;
  allowances: number;
  deductions: number;
  bonus: number;
  taxDeducted: number;
  status: 'draft' | 'processed' | 'paid';
  generatedDate: Date;
  paidDate: Date | null;
  paymentMethod: 'bank_transfer' | 'check' | 'cash';
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  };
  remarks: string;
  createdAt: Date;
  updatedAt: Date;
}

const payrollSchema = new Schema<IPayroll>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2020,
    },
    grossPay: {
      type: Number,
      required: true,
      min: 0,
      set: (v: number) => parseFloat(encryptionService.encrypt(v.toString()) || '0'),
      get: (v: number) => parseFloat(encryptionService.decrypt(v?.toString()) || '0'),
    },
    netPay: {
      type: Number,
      required: true,
      min: 0,
      set: (v: number) => parseFloat(encryptionService.encrypt(v.toString()) || '0'),
      get: (v: number) => parseFloat(encryptionService.decrypt(v?.toString()) || '0'),
    },
    basicPay: {
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
    bonus: {
      type: Number,
      default: 0,
      set: (v: number) => parseFloat(encryptionService.encrypt(v.toString()) || '0'),
      get: (v: number) => parseFloat(encryptionService.decrypt(v?.toString()) || '0'),
    },
    taxDeducted: {
      type: Number,
      default: 0,
      set: (v: number) => parseFloat(encryptionService.encrypt(v.toString()) || '0'),
      get: (v: number) => parseFloat(encryptionService.decrypt(v?.toString()) || '0'),
    },
    status: {
      type: String,
      enum: ['draft', 'processed', 'paid'],
      default: 'draft',
    },
    generatedDate: {
      type: Date,
      default: Date.now,
    },
    paidDate: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'check', 'cash'],
      default: 'bank_transfer',
    },
    bankDetails: {
      bankName: { type: String, default: '' },
      accountNumber: {
        type: String,
        default: '',
        set: (v: string) => (v ? encryptionService.encrypt(v) : v),
        get: (v: string) => (v ? encryptionService.decrypt(v) : v),
      },
      ifscCode: { type: String, default: '' },
    },
    remarks: {
      type: String,
      maxlength: 500,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// ============================================================
// INDEXES
// ============================================================

payrollSchema.index({ userId: 1, year: -1, month: -1 });
payrollSchema.index({ userId: 1, year: -1, month: -1 }, { unique: true });
payrollSchema.index({ status: 1 });

// ============================================================
// PRE-SAVE HOOKS
// ============================================================

payrollSchema.pre('save', function (next) {
  // Calculate net pay
  this.netPay =
    this.basicPay + this.allowances + this.bonus - this.deductions - this.taxDeducted;

  this.grossPay = this.basicPay + this.allowances + this.bonus;

  if (this.netPay < 0) {
    return next(new Error('Net pay cannot be negative'));
  }

  next();
});

// ============================================================
// STATIC METHODS
// ============================================================

payrollSchema.statics.getUserPayroll = function (
  userId: mongoose.Types.ObjectId,
  year?: number
) {
  const filter: Record<string, unknown> = { userId };
  if (year) filter.year = year;
  return this.find(filter).sort({ year: -1, month: -1 });
};

payrollSchema.statics.getCurrentMonthPayroll = function (
  userId: mongoose.Types.ObjectId
) {
  const now = new Date();
  return this.findOne({
    userId,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });
};

export const Payroll = mongoose.model<IPayroll>('Payroll', payrollSchema);
export default Payroll;