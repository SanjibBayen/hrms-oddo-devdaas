export class LeaveDTO {
    static format(leave: any) {
        return {
            id: leave._id,
            leaveType: leave.leaveType,
            startDate: leave.startDate,
            endDate: leave.endDate,
            totalDays: leave.totalDays,
            reason: leave.reason,
            status: leave.status,
            adminComments: leave.adminComments,
            reviewedAt: leave.reviewedAt,
            user: leave.userId ? {
                id: leave.userId._id || leave.userId,
                fullName: leave.userId.personalDetails?.fullName,
                employeeId: leave.userId.employeeId,
                department: leave.userId.jobDetails?.department,
            } : undefined,
        };
    }
}