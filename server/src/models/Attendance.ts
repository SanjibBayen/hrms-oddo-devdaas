import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: string;
  status: 'present' | 'absent' | 'half-day' | 'leave';
  checkInTime: Date | null;
  checkOutTime: Date | null;
  totalHours: number;
  isLate: boolean;
  lateByMinutes: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'half-day', 'leave'],
      default: 'absent',
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    totalHours: {
      type: Number,
      default: 0,
      min: 0,
      max: 24,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    lateByMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    location: {
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
      address: { type: String, default: '' },
    },
    notes: {
      type: String,
      maxlength: 500,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================
// INDEXES
// ============================================================

attendanceSchema.index({ userId: 1, date: -1 });
attendanceSchema.index({ date: -1, status: 1 });
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: -1 });

// ============================================================
// PRE-SAVE HOOKS
// ============================================================

attendanceSchema.pre('save', function (next) {
  // Calculate total hours if both check-in and check-out exist
  if (this.checkInTime && this.checkOutTime) {
    const diffMs = this.checkOutTime.getTime() - this.checkInTime.getTime();
    this.totalHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
  }

  // Determine if late (after 9:15 AM is late)
  if (this.checkInTime) {
    const checkInHour = this.checkInTime.getHours();
    const checkInMinute = this.checkInTime.getMinutes();

    if (checkInHour > 9 || (checkInHour === 9 && checkInMinute > 15)) {
      this.isLate = true;
      const lateThreshold = new Date(this.checkInTime);
      lateThreshold.setHours(9, 15, 0, 0);
      this.lateByMinutes = Math.round(
        (this.checkInTime.getTime() - lateThreshold.getTime()) / (1000 * 60)
      );
    }
  }

  // Update status based on check-in
  if (this.checkInTime && !this.checkOutTime) {
    this.status = 'present';
  } else if (!this.checkInTime && !this.checkOutTime) {
    this.status = 'absent';
  }

  next();
});

// ============================================================
// STATIC METHODS
// ============================================================

attendanceSchema.statics.getTodayAttendance = function (userId: mongoose.Types.ObjectId) {
  const today = new Date().toISOString().split('T')[0];
  return this.findOne({ userId, date: today });
};

attendanceSchema.statics.getMonthlyAttendance = function (
  userId: mongoose.Types.ObjectId,
  year: number,
  month: number
) {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  return this.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1 });
};

attendanceSchema.statics.getDepartmentAttendance = function (
  department: string,
  date: string
) {
  return this.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $match: {
        'user.jobDetails.department': department,
        date: date,
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);
};

// ============================================================
// VIRTUALS
// ============================================================

attendanceSchema.virtual('duration').get(function (this: IAttendance) {
  if (!this.checkInTime || !this.checkOutTime) return 'N/A';
  const hours = Math.floor(this.totalHours);
  const minutes = Math.round((this.totalHours - hours) * 60);
  return `${hours}h ${minutes}m`;
});

export const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);
export default Attendance;