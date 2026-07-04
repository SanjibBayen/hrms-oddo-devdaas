import 'dotenv/config';
import mongoose from 'mongoose';
import dns from 'dns';
import bcrypt from 'bcryptjs';
import { logger } from '../src/config/logger';

// Force IPv4 for Atlas
dns.setDefaultResultOrder('ipv4first');

const MONGODB_URI = process.env.MONGODB_WRITE_URI || 'mongodb://localhost:27017/hrms';

async function seed() {
  try {
    logger.info('Connecting to MongoDB...');
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      family: 4,
    });

    const db = conn.connection.db;
    if (!db) throw new Error('Database not found');

    // Clear existing data
    logger.info('Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('attendances').deleteMany({});
    await db.collection('leaverequests').deleteMany({});
    await db.collection('payrolls').deleteMany({});
    await db.collection('auditlogs').deleteMany({});

    // ============================================================
    // CREATE ADMIN
    // ============================================================
    const adminPassword = await bcrypt.hash('Admin@123', 12);
    await db.collection('users').insertOne({
      employeeId: 'EMP0001',
      email: 'admin@hrms.com',
      password: adminPassword,
      role: 'admin',
      isActive: true,
      loginAttempts: 0,
      lockedUntil: null,
      personalDetails: {
        fullName: 'Admin User',
        phone: '+911234567890',
        address: 'Mumbai, India',
        profilePicture: { publicId: '', secureUrl: '', thumbnailUrl: '' },
      },
      jobDetails: {
        position: 'HR Manager',
        department: 'Human Resources',
        joiningDate: new Date('2024-01-01'),
        employmentType: 'full-time',
      },
      salaryStructure: { base: 80000, allowances: 20000, deductions: 5000 },
      emailVerified: true,
    });
    logger.info('✅ Admin created');

    // ============================================================
    // CREATE EMPLOYEES
    // ============================================================
    const empPassword = await bcrypt.hash('Employee@123', 12);

    const employees = [
      {
        employeeId: 'EMP0002',
        email: 'john@hrms.com',
        password: empPassword,
        role: 'employee',
        isActive: true,
        loginAttempts: 0,
        lockedUntil: null,
        personalDetails: {
          fullName: 'John Doe',
          phone: '+911234567891',
          address: 'Delhi, India',
          profilePicture: { publicId: '', secureUrl: '', thumbnailUrl: '' },
        },
        jobDetails: {
          position: 'Software Engineer',
          department: 'Engineering',
          joiningDate: new Date('2024-02-01'),
          employmentType: 'full-time',
        },
        salaryStructure: { base: 60000, allowances: 15000, deductions: 4000 },
        emailVerified: true,
      },
      {
        employeeId: 'EMP0003',
        email: 'jane@hrms.com',
        password: empPassword,
        role: 'employee',
        isActive: true,
        loginAttempts: 0,
        lockedUntil: null,
        personalDetails: {
          fullName: 'Jane Smith',
          phone: '+911234567892',
          address: 'Bangalore, India',
          profilePicture: { publicId: '', secureUrl: '', thumbnailUrl: '' },
        },
        jobDetails: {
          position: 'UX Designer',
          department: 'Design',
          joiningDate: new Date('2024-03-01'),
          employmentType: 'full-time',
        },
        salaryStructure: { base: 55000, allowances: 12000, deductions: 3500 },
        emailVerified: true,
      },
      {
        employeeId: 'EMP0004',
        email: 'mike@hrms.com',
        password: empPassword,
        role: 'employee',
        isActive: true,
        loginAttempts: 0,
        lockedUntil: null,
        personalDetails: {
          fullName: 'Mike Johnson',
          phone: '+911234567893',
          address: 'Chennai, India',
          profilePicture: { publicId: '', secureUrl: '', thumbnailUrl: '' },
        },
        jobDetails: {
          position: 'Marketing Lead',
          department: 'Marketing',
          joiningDate: new Date('2024-04-01'),
          employmentType: 'full-time',
        },
        salaryStructure: { base: 50000, allowances: 10000, deductions: 3000 },
        emailVerified: true,
      },
      {
        employeeId: 'EMP0005',
        email: 'sarah@hrms.com',
        password: empPassword,
        role: 'employee',
        isActive: true,
        loginAttempts: 0,
        lockedUntil: null,
        personalDetails: {
          fullName: 'Sarah Wilson',
          phone: '+911234567894',
          address: 'Pune, India',
          profilePicture: { publicId: '', secureUrl: '', thumbnailUrl: '' },
        },
        jobDetails: {
          position: 'Accountant',
          department: 'Finance',
          joiningDate: new Date('2024-05-01'),
          employmentType: 'full-time',
        },
        salaryStructure: { base: 45000, allowances: 8000, deductions: 2500 },
        emailVerified: true,
      },
    ];

    await db.collection('users').insertMany(employees);
    logger.info(`✅ ${employees.length} employees created`);

    // ============================================================
    // CREATE SAMPLE ATTENDANCE
    // ============================================================
    const today = new Date().toISOString().split('T')[0];
    const users = await db.collection('users').find({}).toArray();

    const attendances = [
      { userId: users[0]?._id, date: today, status: 'present', checkInTime: new Date(`${today}T09:00:00`), checkOutTime: new Date(`${today}T18:00:00`), totalHours: 9, isLate: false, lateByMinutes: 0, notes: '' },
      { userId: users[1]?._id, date: today, status: 'present', checkInTime: new Date(`${today}T09:10:00`), checkOutTime: new Date(`${today}T18:00:00`), totalHours: 8.8, isLate: false, lateByMinutes: 0, notes: '' },
      { userId: users[2]?._id, date: today, status: 'present', checkInTime: new Date(`${today}T09:30:00`), checkOutTime: null, totalHours: 0, isLate: true, lateByMinutes: 15, notes: 'Traffic delay' },
      { userId: users[3]?._id, date: today, status: 'absent', checkInTime: null, checkOutTime: null, totalHours: 0, isLate: false, lateByMinutes: 0, notes: '' },
    ].filter(a => a.userId);

    if (attendances.length > 0) {
      await db.collection('attendances').insertMany(attendances);
      logger.info('✅ Sample attendance created');
    }

    // ============================================================
    // CREATE SAMPLE LEAVE REQUEST
    // ============================================================
    if (users[1]) {
      await db.collection('leaverequests').insertOne({
        userId: users[1]._id,
        leaveType: 'sick',
        startDate: '2026-07-10',
        endDate: '2026-07-11',
        totalDays: 2,
        reason: 'Not feeling well, need medical rest for two days',
        status: 'pending',
        adminComments: '',
        reviewedBy: null,
        reviewedAt: null,
      });
      logger.info('✅ Sample leave request created');
    }

    // ============================================================
    // DONE
    // ============================================================
    logger.info('\n========================================');
    logger.info('  SEEDING COMPLETE!');
    logger.info('========================================');
    logger.info('');
    logger.info('Login Credentials:');
    logger.info('  Admin:    admin@hrms.com / Admin@123');
    logger.info('  Employee: john@hrms.com / Employee@123');
    logger.info('  Employee: jane@hrms.com / Employee@123');
    logger.info('');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();