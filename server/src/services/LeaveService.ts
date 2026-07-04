import mongoose from 'mongoose';
import { LeaveRequest } from '../models/LeaveRequest';
import { redisManager } from '../config/redis';

interface LeaveApplicationData {
  leaveType: 'paid' | 'sick' | 'unpaid' | 'casual';
  startDate: string;
  endDate: string;
  reason: string;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
  }>;
}

export class LeaveService {
  static async applyLeave(userId: string, data: LeaveApplicationData) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const overlappingLeaves = await (LeaveRequest as any).getOverlappingLeaves(
      userObjectId,
      data.startDate,
      data.endDate
    );

    if (overlappingLeaves.length) {
      throw new Error('Leave request overlaps with an existing pending or approved leave');
    }

    const leave = await LeaveRequest.create({
      userId: userObjectId,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      attachments: data.attachments || [],
    });

    await redisManager.delPattern(`leaves:${userId}:*`);
    return leave;
  }

  static async getMyLeaves(userId: string) {
    const cacheKey = `leaves:${userId}:all`;
    const cached = await redisManager.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const leaves = await LeaveRequest.find({ userId }).sort({ createdAt: -1 });
    await redisManager.set(cacheKey, JSON.stringify(leaves), 300);
    return leaves;
  }

  static async getPendingLeaves() {
    return LeaveRequest.find({ status: 'pending' })
      .populate('userId', 'personalDetails.fullName employeeId jobDetails.department')
      .sort({ createdAt: -1 });
  }

  static async updateLeaveStatus(
    adminId: string,
    leaveId: string,
    status: 'approved' | 'rejected' | 'cancelled',
    comments?: string
  ) {
    const leave = await LeaveRequest.findByIdAndUpdate(
      leaveId,
      {
        $set: {
          status,
          adminComments: comments || '',
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!leave) throw new Error('Leave request not found');

    await redisManager.delPattern(`leaves:${leave.userId}:*`);
    return leave;
  }

  static async getLeaveBalance(userId: string) {
    return (LeaveRequest as any).getLeaveBalance(
      new mongoose.Types.ObjectId(userId),
      new Date().getFullYear()
    );
  }
}

export default LeaveService;
