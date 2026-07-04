import mongoose, { Schema, Document } from 'mongoose';

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
  status: 'draft' | 'processed' | 'paid';
  generatedDate: Date;
  paidDate: Date | null;
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
      required: [true, 'Month is required'],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: 2020,
      max: 2100,
    },
    grossPay: { type: Number, default: 0, min: 0 },
    netPay: { type: Number, default: 0, min: 0 },
    basicPay: { type: Number, default: 0, min: 0 },
    allowances: { type: Number, default: 0, min: 0 },
    deductions: { type: Number, default: 0, min: 0 },
    bonus: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['draft', 'processed', 'paid'],
      default: 'draft',
    },
    generatedDate: { type: Date, default: Date.now },
    paidDate: { type: Date, default: null },
    remarks: { type: String, maxlength: 500, default: '' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

payrollSchema.index({ userId: 1, year: -1, month: -1 }, { unique: true });
payrollSchema.index({ status: 1 });
payrollSchema.index({ year: -1, month: -1 });

payrollSchema.pre('save', function (next) {
  this.grossPay = this.basicPay + this.allowances + this.bonus;
  this.netPay = this.grossPay - this.deductions;

  if (this.netPay < 0) {
    return next(new Error('Net pay cannot be negative'));
  }

  next();
});

payrollSchema.virtual('monthName').get(function (this: IPayroll) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[this.month - 1] || 'Unknown';
});

export const Payroll = mongoose.model<IPayroll>('Payroll', payrollSchema);
export default Payroll;