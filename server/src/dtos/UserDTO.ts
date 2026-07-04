export class UserDTO {
    static toPublic(user: any) {
        return {
            id: user._id,
            employeeId: user.employeeId,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            personalDetails: {
                fullName: user.personalDetails?.fullName,
                profilePicture: user.personalDetails?.profilePicture,
            },
            jobDetails: {
                position: user.jobDetails?.position,
                department: user.jobDetails?.department,
                joiningDate: user.jobDetails?.joiningDate,
                employmentType: user.jobDetails?.employmentType,
            },
        };
    }

    static toPrivate(user: any) {
        return {
            ...this.toPublic(user),
            personalDetails: {
                ...this.toPublic(user).personalDetails,
                phone: user.personalDetails?.phone,
                address: user.personalDetails?.address,
            },
            salaryStructure: user.salaryStructure,
        };
    }

    static toList(users: any[]) {
        return users.map(u => this.toPublic(u));
    }
}