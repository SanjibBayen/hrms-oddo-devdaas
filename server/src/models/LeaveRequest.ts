import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaveRequest extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  leaveType: 'paid' | 'sick' | 'unpaid' | 'casual';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  adminComments: string;
  reviewedBy: mongoose.Types.ObjectId | null;
  reviewedAt: Date | null;
  attachments: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const leaveRequestSchema = new Schema<ILeaveRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    leaveType: {
      type: String,
      required: [true, 'Leave type is required'],
      enum: ['paid', 'sick', 'unpaid', 'casual'],
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'],
    },
    endDate: {
      type: String,
      required: [true, 'End date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'],
    },
    totalDays: {
      type: Number,
      required: true,
      min: 0.5,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      minlength: [10, 'Reason must be at least 10 characters'],
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
    adminComments: {
      type: String,
      maxlength: 500,
      default: '',
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ============================================================
// INDEXES
// ============================================================

leaveRequestSchema.index({ userId: 1, status: 1 });
leaveRequestSchema.index({ status: 1, createdAt: -1 });
leaveRequestSchema.index({ startDate: 1, endDate: 1 });
leaveRequestSchema.index({ userId: 1, startDate: 1, endDate: 1 });

// ============================================================
// PRE-SAVE HOOKS
// ============================================================

leaveRequestSchema.pre('save', function (next) {
  // Calculate total days
  if (this.startDate && this.endDate) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffTime = end.getTime() - start.getTime();
    this.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  // Validate start date is before end date
  if (new Date(this.startDate) > new Date(this.endDate)) {
    return next(new Error('Start date must be before end date'));
  }

  // Validate not in the past
  if (new Date(this.startDate) < new Date(new Date().toISOString().split('T')[0]!)) {
    return next(new Error('Cannot apply for past dates'));
  }

  next();
});

// ============================================================
// STATIC METHODS
// ============================================================

leaveRequestSchema.statics.getPendingLeaves = function () {
  return this.find({ status: 'pending' })
    .populate('userId', 'personalDetails.fullName employeeId jobDetails.department')
    .sort({ createdAt: -1 });
};

leaveRequestSchema.statics.getUserLeaves = function (userId: mongoose.Types.ObjectId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

leaveRequestSchema.statics.getOverlappingLeaves = function (
  userId: mongoose.Types.ObjectId,
  startDate: string,
  endDate: string
) {
  return this.find({
    userId,
    status: { $in: ['pending', 'approved'] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
    ],
  });
};

leaveRequestSchema.statics.getLeaveBalance = async function (
  userId: mongoose.Types.ObjectId,
  year: number
) {
  const result = await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: 'approved',
        startDate: { $regex: `^${year}` },
      },
    },
    {
      $group: {
        _id: '$leaveType',
        totalDays: { $sum: '$totalDays' },
      },
    },
  ]);

  const balance: Record<'paid' | 'sick' | 'casual' | 'unpaid', number> = {
    paid: 24,
    sick: 12,
    casual: 6,
    unpaid: 0,
  };

  result.forEach((item: { _id: string; totalDays: number }) => {
    if (item._id in balance) {
      balance[item._id as keyof typeof balance] -= item.totalDays;
    }
  });

  return balance;
};

export const LeaveRequest = mongoose.model<ILeaveRequest>('LeaveRequest', leaveRequestSchema);
export default LeaveRequest;