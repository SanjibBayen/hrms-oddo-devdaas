import { Request, Response, NextFunction } from 'express';

type ABACPolicy = (user: any, resource: any) => boolean;

const policies: Record<string, ABACPolicy> = {
    'update:own_profile': (user, targetUserId) => {
        return user._id.toString() === targetUserId;
    },
    'view:salary': (user, targetUser) => {
        if (['admin', 'super_admin'].includes(user.role)) return true;
        return user._id.toString() === targetUser._id.toString();
    },
    'approve:leave': (user, leaveRequest) => {
        if (['admin', 'super_admin'].includes(user.role)) return true;
        return false;
    },
};

export const enforceABAC = (action: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user) {
            return res.status(401).json({
                status: 'error',
                code: 'AUTH_REQUIRED',
                message: 'Authentication required',
            });
        }

        const policy = policies[action];
        if (!policy) {
            return next();
        }

        const resourceId = req.params.id || req.body.userId;
        const isAllowed = policy(user, resourceId);

        if (!isAllowed) {
            return res.status(403).json({
                status: 'error',
                code: 'FORBIDDEN',
                message: 'You do not have permission to perform this action',
            });
        }

        next();
    };
};