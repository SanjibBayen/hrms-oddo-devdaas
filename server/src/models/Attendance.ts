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
        },
        date: {
            type: String,
            required: [true, 'Date is required'],
            match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'],
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'half-day', 'leave'],
            default: 'absent',
        },
        checkInTime: { type: Date, default: null },
        checkOutTime: { type: Date, default: null },
        totalHours: { type: Number, default: 0, min: 0, max: 24 },
        isLate: { type: Boolean, default: false },
        lateByMinutes: { type: Number, default: 0, min: 0 },
        notes: { type: String, maxlength: 500, default: '' },
    },
    { timestamps: true }
);

attendanceSchema.index({ userId: 1, date: -1 });
attendanceSchema.index({ date: -1, status: 1 });
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

const OFFICE_START_HOUR = 9;
const OFFICE_START_MINUTE = 15;

attendanceSchema.pre('save', function (next) {
    if (this.checkInTime && this.checkOutTime) {
        const diffMs = this.checkOutTime.getTime() - this.checkInTime.getTime();
        this.totalHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
    }

    if (this.checkInTime) {
        const hour = this.checkInTime.getHours();
        const minute = this.checkInTime.getMinutes();
        const totalMinutes = hour * 60 + minute;
        const thresholdMinutes = OFFICE_START_HOUR * 60 + OFFICE_START_MINUTE;

        if (totalMinutes > thresholdMinutes) {
            this.isLate = true;
            this.lateByMinutes = totalMinutes - thresholdMinutes;
        }
    }

    if (this.checkInTime && !this.checkOutTime) {
        this.status = 'present';
    }

    next();
});

export const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);
export default Attendance;