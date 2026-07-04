export class PayrollDTO {
    static format(payroll: any) {
        return {
            id: payroll._id,
            month: payroll.month,
            year: payroll.year,
            grossPay: payroll.grossPay,
            netPay: payroll.netPay,
            basicPay: payroll.basicPay,
            allowances: payroll.allowances,
            deductions: payroll.deductions,
            bonus: payroll.bonus,
            status: payroll.status,
            user: payroll.userId ? {
                id: payroll.userId._id || payroll.userId,
                fullName: payroll.userId.personalDetails?.fullName,
                employeeId: payroll.userId.employeeId,
            } : undefined,
        };
    }
}