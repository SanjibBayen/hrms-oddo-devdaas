import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshToken extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    token: string;
    tokenId: string;
    fingerprint: string;
    expiresAt: Date;
    isRevoked: boolean;
    revokedAt: Date | null;
    createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        tokenId: {
            type: String,
            required: true,
            unique: true,
        },
        fingerprint: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        isRevoked: {
            type: Boolean,
            default: false,
        },
        revokedAt: {
            type: Date,
            default: null,
        },
        createdAt: {
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

refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ tokenId: 1 }, { unique: true });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ isRevoked: 1 });

// ============================================================
// STATIC METHODS
// ============================================================

refreshTokenSchema.statics.findValidToken = function (tokenId: string) {
    return this.findOne({
        tokenId,
        isRevoked: false,
        expiresAt: { $gt: new Date() },
    });
};

refreshTokenSchema.statics.revokeAllUserTokens = async function (
    userId: mongoose.Types.ObjectId
) {
    return this.updateMany(
        { userId, isRevoked: false },
        { isRevoked: true, revokedAt: new Date() }
    );
};

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
export default RefreshToken;