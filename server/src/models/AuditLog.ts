import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    action: string;
    resource: string;
    resourceId: string;
    details: string;
    ipAddress: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'success' | 'failure';
    timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String, default: '' },
    details: { type: String, default: '' },
    ipAddress: { type: String, required: true },
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
    timestamp: { type: Date, default: Date.now },
});

auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
export default AuditLog;