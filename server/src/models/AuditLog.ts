import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failure';
  metadata: Record<string, unknown>;
  timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
    resourceId: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      default: '',
    },
    changes: [
      {
        field: String,
        oldValue: String,
        newValue: String,
      },
    ],
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      default: '',
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// ============================================================
// INDEXES
// ============================================================

auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1 });
auditLogSchema.index({ timestamp: -1 });

// TTL index: auto-delete after 90 days
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// ============================================================
// STATIC METHODS
// ============================================================

auditLogSchema.statics.logEvent = async function (data: {
  userId: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  changes?: Array<{ field: string; oldValue: string; newValue: string }>;
  ipAddress: string;
  userAgent?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'success' | 'failure';
  metadata?: Record<string, unknown>;
}) {
  return this.create({
    ...data,
    timestamp: new Date(),
  });
};

auditLogSchema.statics.getUserActivity = function (
  userId: mongoose.Types.ObjectId,
  limit: number = 50
) {
  return this.find({ userId }).sort({ timestamp: -1 }).limit(limit);
};

auditLogSchema.statics.getSecurityEvents = function (limit: number = 100) {
  return this.find({
    severity: { $in: ['high', 'critical'] },
  })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('userId', 'personalDetails.fullName employeeId');
};

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
export default AuditLog;