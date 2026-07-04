import { User } from '../models/User';
import { jwtService } from '../utils/jwt';
import { redisManager } from '../config/redis';

type AuthResponse = {
  user: {
    id: any;
    employeeId: string;
    email: string;
    role: string;
    fullName: string;
  };
  accessToken: string;
  refreshToken: string;
};

export class AuthService {
  static async signup(data: {
    employeeId: string;
    email: string;
    password: string;
    fullName: string;
    position: string;
    department: string;
  }): Promise<AuthResponse> {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await User.create({
      employeeId: data.employeeId.toUpperCase(),
      email: data.email.toLowerCase(),
      password: data.password,
      role: 'employee',
      personalDetails: { fullName: data.fullName },
      jobDetails: { position: data.position, department: data.department },
    });

    const tokens = jwtService.generateTokenPair({
      _id: user._id.toString(),
      employeeId: user.employeeId,
      role: user.role,
    });

    return {
      user: {
        id: user._id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        fullName: user.personalDetails.fullName,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    if (user.isLocked()) {
      throw new Error('Account is locked. Try again later.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incrementLoginAttempts();
      throw new Error('Invalid email or password');
    }

    await user.resetLoginAttempts();

    const tokens = jwtService.generateTokenPair({
      _id: user._id.toString(),
      employeeId: user.employeeId,
      role: user.role,
    });

    return {
      user: {
        id: user._id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        fullName: user.personalDetails.fullName,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  static async refreshToken(
    userId: string,
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded = jwtService.verifyRefreshToken(refreshToken);
    const isValid = await jwtService.validateRefreshToken(userId, decoded.tokenId!);

    if (!isValid) {
      await jwtService.revokeRefreshToken(userId);
      throw new Error('Invalid refresh token');
    }

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    await jwtService.revokeRefreshToken(userId);

    const tokens = jwtService.generateTokenPair({
      _id: user._id.toString(),
      employeeId: user.employeeId,
      role: user.role,
    });

    return tokens;
  }

  static async logout(userId: string): Promise<{ message: string }> {
    await jwtService.revokeRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }
}
