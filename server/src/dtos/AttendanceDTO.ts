export class AttendanceDTO {
    static format(record: any) {
        return {
            id: record._id,
            date: record.date,
            status: record.status,
            checkInTime: record.checkInTime,
            checkOutTime: record.checkOutTime,
            totalHours: record.totalHours,
            isLate: record.isLate,
            lateByMinutes: record.lateByMinutes,
            notes: record.notes,
            user: record.userId ? {
                id: record.userId._id || record.userId,
                fullName: record.userId.personalDetails?.fullName,
                employeeId: record.userId.employeeId,
            } : undefined,
        };
    }
}