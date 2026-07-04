import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { 
  Employee, 
  AttendanceLog, 
  LeaveRequest, 
  Payroll, 
  ActivityLog, 
  UserRole,
  AttendanceStatus,
  LeaveStatus,
  PayrollStatus
} from "./src/types/index.ts";

// Initialize express app
const app = express();
const PORT = 3000;

// JSON parser
app.use(express.json({ limit: '10mb' }));

// ==========================================
// Stateful In-Memory Database (Pre-seeded)
// ==========================================

let employees: Employee[] = [
  {
    id: "EMP001",
    name: "Sarah Connor",
    email: "sarah.admin@enterprise.com",
    role: "ADMIN",
    department: "Human Resources",
    designation: "HR Director",
    joiningDate: "2024-01-15",
    salary: 8500,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    phone: "+1 (555) 123-4567",
    status: "ACTIVE",
    bankAccount: "US8937000123456789",
    taxId: "TX-9921-A"
  },
  {
    id: "EMP002",
    name: "David Miller",
    email: "david.miller@enterprise.com",
    role: "MANAGER",
    department: "Engineering",
    designation: "Lead Software Architect",
    joiningDate: "2024-03-10",
    salary: 7200,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    phone: "+1 (555) 987-6543",
    status: "ACTIVE",
    bankAccount: "US8937000987654321",
    taxId: "TX-8832-B"
  },
  {
    id: "EMP003",
    name: "Jane Doe",
    email: "jane.doe@enterprise.com",
    role: "EMPLOYEE",
    department: "Engineering",
    designation: "Senior Frontend Engineer",
    joiningDate: "2024-06-01",
    salary: 5800,
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    phone: "+1 (555) 456-7890",
    status: "ACTIVE",
    bankAccount: "US8937000456789012",
    taxId: "TX-7743-C"
  },
  {
    id: "EMP004",
    name: "John Smith",
    email: "john.smith@enterprise.com",
    role: "EMPLOYEE",
    department: "Design",
    designation: "Product Designer",
    joiningDate: "2024-08-20",
    salary: 5200,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    phone: "+1 (555) 234-5678",
    status: "ACTIVE",
    bankAccount: "US8937000234567890",
    taxId: "TX-6654-D"
  },
  {
    id: "EMP005",
    name: "Michael Chang",
    email: "michael.c@enterprise.com",
    role: "EMPLOYEE",
    department: "Engineering",
    designation: "QA Engineer",
    joiningDate: "2025-01-10",
    salary: 4500,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    phone: "+1 (555) 876-5432",
    status: "ACTIVE",
    bankAccount: "US8937000876543210",
    taxId: "TX-5512-E"
  }
];

let attendance: AttendanceLog[] = [
  // Past logs for Sarah
  { id: "ATT001", userId: "EMP001", date: "2026-07-01", checkIn: "08:55:00", checkOut: "17:30:00", status: "PRESENT", workHours: 8.5 },
  { id: "ATT002", userId: "EMP001", date: "2026-07-02", checkIn: "08:45:00", checkOut: "17:05:00", status: "PRESENT", workHours: 8.3 },
  // Past logs for David
  { id: "ATT003", userId: "EMP002", date: "2026-07-01", checkIn: "09:02:00", checkOut: "18:15:00", status: "PRESENT", workHours: 9.2 },
  { id: "ATT004", userId: "EMP002", date: "2026-07-02", checkIn: "09:15:00", checkOut: "18:00:00", status: "LATE", workHours: 8.75 },
  // Past logs for Jane
  { id: "ATT005", userId: "EMP003", date: "2026-07-01", checkIn: "08:50:00", checkOut: "17:35:00", status: "PRESENT", workHours: 8.75 },
  { id: "ATT006", userId: "EMP003", date: "2026-07-02", checkIn: null, checkOut: null, status: "ABSENT", workHours: 0 },
  // Past logs for John
  { id: "ATT007", userId: "EMP004", date: "2026-07-01", checkIn: "09:10:00", checkOut: "17:45:00", status: "LATE", workHours: 8.5 },
  { id: "ATT008", userId: "EMP004", date: "2026-07-02", checkIn: "08:58:00", checkOut: "17:00:00", status: "PRESENT", workHours: 8.0 },
  // Today's Checkins (Sarah checked in, David checked in, Jane late, John not yet checked in, Michael on leave)
  { id: "ATT009", userId: "EMP001", date: "2026-07-03", checkIn: "08:50:00", checkOut: null, status: "PRESENT", workHours: 0 },
  { id: "ATT010", userId: "EMP002", date: "2026-07-03", checkIn: "09:20:00", checkOut: null, status: "LATE", workHours: 0 },
  { id: "ATT011", userId: "EMP005", date: "2026-07-03", checkIn: null, checkOut: null, status: "ON_LEAVE", workHours: 0 }
];

let leaves: LeaveRequest[] = [
  {
    id: "LV001",
    userId: "EMP003",
    userName: "Jane Doe",
    department: "Engineering",
    leaveType: "SICK",
    startDate: "2026-07-02",
    endDate: "2026-07-02",
    reason: "Severe dental issue and dentist appointment.",
    status: "APPROVED",
    appliedDate: "2026-07-01",
    approvedBy: "EMP001",
    approvedDate: "2026-07-01"
  },
  {
    id: "LV002",
    userId: "EMP005",
    userName: "Michael Chang",
    department: "Engineering",
    leaveType: "ANNUAL",
    startDate: "2026-07-03",
    endDate: "2026-07-05",
    reason: "Family gathering in hometown.",
    status: "APPROVED",
    appliedDate: "2026-06-25",
    approvedBy: "EMP001",
    approvedDate: "2026-06-26"
  },
  {
    id: "LV003",
    userId: "EMP004",
    userName: "John Smith",
    department: "Design",
    leaveType: "CASUAL",
    startDate: "2026-07-10",
    endDate: "2026-07-12",
    reason: "Urgent personal business out of state.",
    status: "PENDING",
    appliedDate: "2026-07-02"
  },
  {
    id: "LV004",
    userId: "EMP003",
    userName: "Jane Doe",
    department: "Engineering",
    leaveType: "MATERNITY",
    startDate: "2026-08-15",
    endDate: "2026-11-15",
    reason: "Maternity leave request as discussed.",
    status: "PENDING",
    appliedDate: "2026-07-03"
  }
];

let payrolls: Payroll[] = [
  {
    id: "PAY001",
    userId: "EMP001",
    userName: "Sarah Connor",
    department: "Human Resources",
    designation: "HR Director",
    month: "2026-06",
    basicSalary: 8500,
    allowances: 500,
    deductions: 420,
    netSalary: 8580,
    status: "PAID",
    processedDate: "2026-06-28"
  },
  {
    id: "PAY002",
    userId: "EMP002",
    userName: "David Miller",
    department: "Engineering",
    designation: "Lead Software Architect",
    month: "2026-06",
    basicSalary: 7200,
    allowances: 400,
    deductions: 360,
    netSalary: 7240,
    status: "PAID",
    processedDate: "2026-06-28"
  },
  {
    id: "PAY003",
    userId: "EMP003",
    userName: "Jane Doe",
    department: "Engineering",
    designation: "Senior Frontend Engineer",
    month: "2026-06",
    basicSalary: 5800,
    allowances: 300,
    deductions: 290,
    netSalary: 5810,
    status: "PAID",
    processedDate: "2026-06-28"
  },
  // Draft payrolls for current month (July 2026)
  {
    id: "PAY004",
    userId: "EMP001",
    userName: "Sarah Connor",
    department: "Human Resources",
    designation: "HR Director",
    month: "2026-07",
    basicSalary: 8500,
    allowances: 500,
    deductions: 450,
    netSalary: 8550,
    status: "DRAFT"
  },
  {
    id: "PAY005",
    userId: "EMP002",
    userName: "David Miller",
    department: "Engineering",
    designation: "Lead Software Architect",
    month: "2026-07",
    basicSalary: 7200,
    allowances: 400,
    deductions: 380,
    netSalary: 7220,
    status: "DRAFT"
  }
];

let activityLogs: ActivityLog[] = [
  { id: "ACT001", userId: "EMP001", userName: "Sarah Connor", action: "Logged in successfully", category: "AUTH", timestamp: "2026-07-03T08:30:00Z" },
  { id: "ACT002", userId: "EMP001", userName: "Sarah Connor", action: "Approved leave request LV001 for Jane Doe", category: "LEAVE", timestamp: "2026-07-01T10:15:00Z" },
  { id: "ACT003", userId: "EMP003", userName: "Jane Doe", action: "Checked in", category: "ATTENDANCE", timestamp: "2026-07-01T08:50:00Z" },
  { id: "ACT004", userId: "EMP002", userName: "David Miller", action: "Updated profile details", category: "PROFILE", timestamp: "2026-07-02T14:22:00Z" }
];

// Helper to log audit actions
const logAction = (userId: string, action: string, category: ActivityLog['category']) => {
  const employee = employees.find(e => e.id === userId);
  const userName = employee ? employee.name : "Unknown Employee";
  activityLogs.unshift({
    id: `ACT${Math.floor(Math.random() * 90000) + 10000}`,
    userId,
    userName,
    action,
    category,
    timestamp: new Date().toISOString()
  });
};

// ==========================================
// API Endpoints
// ==========================================

// Auth API
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  
  // High-fidelity matching: support any of our seeded emails with any non-empty password
  const employee = employees.find(e => e.email.toLowerCase() === email.toLowerCase());
  
  if (employee) {
    logAction(employee.id, "Logged in successfully", "AUTH");
    res.json({
      token: `token-secret-${employee.id}`,
      user: employee
    });
  } else {
    // Fallback: if not found, let's create a temporary session employee or return error
    res.status(401).json({ message: "Invalid email or credentials" });
  }
});

app.get("/api/auth/me", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  const empId = token.replace("token-secret-", "");
  const employee = employees.find(e => e.id === empId);
  
  if (employee) {
    res.json(employee);
  } else {
    res.status(401).json({ message: "Session expired or user not found" });
  }
});

// Stats API
app.get("/api/stats", (req, res) => {
  const today = "2026-07-03";
  const activeEmployees = employees.filter(e => e.status === "ACTIVE");
  const todayLogs = attendance.filter(a => a.date === today);
  const presentToday = todayLogs.filter(a => a.status === "PRESENT" || a.status === "LATE" || a.status === "HALF_DAY").length;
  const lateToday = todayLogs.filter(a => a.status === "LATE").length;
  const pendingLeaves = leaves.filter(l => l.status === "PENDING").length;
  
  // Payroll calculation
  const totalPayrollThisMonth = payrolls
    .filter(p => p.month === "2026-07")
    .reduce((sum, p) => sum + p.netSalary, 0);

  res.json({
    totalEmployees: employees.length,
    activeEmployees: activeEmployees.length,
    presentToday,
    lateToday,
    pendingLeaves,
    totalPayrollThisMonth: totalPayrollThisMonth || 31200 // default fallback
  });
});

// Employees (User) API
app.get("/api/employees", (req, res) => {
  res.json(employees);
});

app.post("/api/employees", (req, res) => {
  const { name, email, role, department, designation, salary, phone, bankAccount, taxId } = req.body;
  const id = `EMP00${employees.length + 1}`;
  
  const newEmployee: Employee = {
    id,
    name,
    email,
    role: role as UserRole,
    department,
    designation,
    joiningDate: new Date().toISOString().split('T')[0],
    salary: Number(salary) || 4000,
    avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random()*100000)}?w=150`,
    phone: phone || "+1 (555) 000-0000",
    status: "ACTIVE",
    bankAccount,
    taxId
  };
  
  employees.push(newEmployee);
  logAction("EMP001", `Created employee ${name} (${id})`, "PROFILE");
  res.status(201).json(newEmployee);
});

app.put("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  const index = employees.findIndex(e => e.id === id);
  
  if (index !== -1) {
    employees[index] = {
      ...employees[index],
      ...req.body
    };
    logAction(id, "Updated employee file", "PROFILE");
    res.json(employees[index]);
  } else {
    res.status(404).json({ message: "Employee not found" });
  }
});

app.delete("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  const index = employees.findIndex(e => e.id === id);
  if (index !== -1) {
    const emp = employees[index];
    emp.status = "INACTIVE"; // Soft delete / deactivation
    logAction("EMP001", `Deactivated employee ${emp.name}`, "PROFILE");
    res.json({ message: "Employee deactivated successfully", employee: emp });
  } else {
    res.status(404).json({ message: "Employee not found" });
  }
});

// Attendance API
app.get("/api/attendance", (req, res) => {
  const { userId, date } = req.query;
  let filtered = [...attendance];
  
  if (userId) {
    filtered = filtered.filter(a => a.userId === userId);
  }
  if (date) {
    filtered = filtered.filter(a => a.date === date);
  }
  
  // Attach employee data
  const response = filtered.map(log => {
    const emp = employees.find(e => e.id === log.userId);
    return {
      ...log,
      employeeName: emp ? emp.name : "Unknown",
      department: emp ? emp.department : "Unknown"
    };
  });
  
  res.json(response);
});

app.post("/api/attendance/check-in", (req, res) => {
  const { userId, notes } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const time = new Date().toTimeString().split(' ')[0];
  
  // Check if already checked in today
  const existingIndex = attendance.findIndex(a => a.userId === userId && a.date === today);
  
  if (existingIndex !== -1) {
    return res.status(400).json({ message: "Already checked in today" });
  }
  
  const id = `ATT${Math.floor(Math.random() * 90000) + 10000}`;
  
  // Determine if late (after 09:00:00)
  const isLate = time > "09:00:00";
  const status: AttendanceStatus = isLate ? "LATE" : "PRESENT";
  
  const newLog: AttendanceLog = {
    id,
    userId,
    date: today,
    checkIn: time,
    checkOut: null,
    status,
    workHours: 0,
    notes
  };
  
  attendance.push(newLog);
  logAction(userId, `Checked in at ${time} (${status})`, "ATTENDANCE");
  res.status(201).json(newLog);
});

app.post("/api/attendance/check-out", (req, res) => {
  const { userId } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const time = new Date().toTimeString().split(' ')[0];
  
  const index = attendance.findIndex(a => a.userId === userId && a.date === today);
  
  if (index === -1) {
    return res.status(400).json({ message: "No active check-in record for today. Please check-in first." });
  }
  
  const log = attendance[index];
  if (log.checkOut) {
    return res.status(400).json({ message: "Already checked out today" });
  }
  
  log.checkOut = time;
  
  // Calculate hours
  if (log.checkIn) {
    const [inH, inM, inS] = log.checkIn.split(':').map(Number);
    const [outH, outM, outS] = time.split(':').map(Number);
    const diffMs = (outH * 3600 + outM * 60 + outS) - (inH * 3600 + inM * 60 + inS);
    log.workHours = Math.max(0, Number((diffMs / 3600).toFixed(2)));
  }
  
  logAction(userId, `Checked out at ${time}. Total hours: ${log.workHours}`, "ATTENDANCE");
  res.json(log);
});

// Submit/approve Manual Attendance
app.post("/api/attendance/manual", (req, res) => {
  const { userId, date, checkIn, checkOut, status, notes } = req.body;
  const id = `ATT${Math.floor(Math.random() * 90000) + 10000}`;
  
  // Calculate hours if checkIn and checkOut
  let workHours = 0;
  if (checkIn && checkOut) {
    const [inH, inM] = checkIn.split(':').map(Number);
    const [outH, outM] = checkOut.split(':').map(Number);
    workHours = Number((outH - inH + (outM - inM)/60).toFixed(2));
  }
  
  const newLog: AttendanceLog = {
    id,
    userId,
    date,
    checkIn,
    checkOut,
    status: status as AttendanceStatus,
    workHours,
    notes
  };
  
  attendance.push(newLog);
  logAction("EMP001", `Logged manual attendance for ${userId} on ${date}`, "ATTENDANCE");
  res.status(201).json(newLog);
});

// Leave API
app.get("/api/leaves", (req, res) => {
  const { userId } = req.query;
  if (userId) {
    return res.json(leaves.filter(l => l.userId === userId));
  }
  res.json(leaves);
});

app.post("/api/leaves", (req, res) => {
  const { userId, leaveType, startDate, endDate, reason } = req.body;
  const emp = employees.find(e => e.id === userId);
  
  if (!emp) {
    return res.status(404).json({ message: "Employee not found" });
  }
  
  const id = `LV00${leaves.length + 1}`;
  const newLeave: LeaveRequest = {
    id,
    userId,
    userName: emp.name,
    department: emp.department,
    leaveType: leaveType as any,
    startDate,
    endDate,
    reason,
    status: "PENDING",
    appliedDate: new Date().toISOString().split('T')[0]
  };
  
  leaves.push(newLeave);
  logAction(userId, `Applied for ${leaveType} leave from ${startDate} to ${endDate}`, "LEAVE");
  res.status(201).json(newLeave);
});

app.put("/api/leaves/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, approvedBy } = req.body;
  
  const index = leaves.findIndex(l => l.id === id);
  if (index !== -1) {
    const leave = leaves[index];
    leave.status = status as LeaveStatus;
    leave.approvedBy = approvedBy;
    leave.approvedDate = new Date().toISOString().split('T')[0];
    
    logAction(approvedBy, `${status} leave application ${id} for ${leave.userName}`, "LEAVE");
    
    // If approved, block attendance logs for those dates
    if (status === "APPROVED") {
      let current = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      
      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        // Ensure no duplicate attendance log for that day
        const attIdx = attendance.findIndex(a => a.userId === leave.userId && a.date === dateStr);
        if (attIdx === -1) {
          attendance.push({
            id: `ATT${Math.floor(Math.random() * 90000) + 10000}`,
            userId: leave.userId,
            date: dateStr,
            checkIn: null,
            checkOut: null,
            status: "ON_LEAVE",
            workHours: 0,
            notes: `Approved Leave: ${leave.leaveType}`
          });
        } else {
          attendance[attIdx].status = "ON_LEAVE";
        }
        current.setDate(current.getDate() + 1);
      }
    }
    
    res.json(leave);
  } else {
    res.status(404).json({ message: "Leave request not found" });
  }
});

// Payroll API
app.get("/api/payrolls", (req, res) => {
  const { userId, month } = req.query;
  let filtered = [...payrolls];
  
  if (userId) {
    filtered = filtered.filter(p => p.userId === userId);
  }
  if (month) {
    filtered = filtered.filter(p => p.month === month);
  }
  
  res.json(filtered);
});

// Calculate/Generate payroll for a month
app.post("/api/payrolls/calculate", (req, res) => {
  const { month } = req.body; // YYYY-MM
  
  // Remove existing DRAFT payrolls for this month to recalculate
  payrolls = payrolls.filter(p => !(p.month === month && p.status === "DRAFT"));
  
  const generated: Payroll[] = [];
  
  employees.forEach(emp => {
    // Only calculate for active employees
    if (emp.status !== "ACTIVE") return;
    
    // Check if payroll already paid
    const alreadyPaid = payrolls.some(p => p.userId === emp.id && p.month === month && p.status === "PAID");
    if (alreadyPaid) return;
    
    // Dynamic calculations based on attendance
    const empLogs = attendance.filter(a => a.userId === emp.id && a.date.startsWith(month));
    const absentDays = empLogs.filter(a => a.status === "ABSENT").length;
    
    // Pre-seeded deductions & allowances rules
    const basicSalary = emp.salary;
    const allowances = Math.round(basicSalary * 0.05); // 5% allowance
    
    // Deduction: $100 per day absent
    const deductions = Math.round(basicSalary * 0.06) + (absentDays * 120); 
    const netSalary = basicSalary + allowances - deductions;
    
    const item: Payroll = {
      id: `PAY${Math.floor(Math.random() * 90000) + 10000}`,
      userId: emp.id,
      userName: emp.name,
      department: emp.department,
      designation: emp.designation,
      month,
      basicSalary,
      allowances,
      deductions,
      netSalary,
      status: "DRAFT"
    };
    
    payrolls.push(item);
    generated.push(item);
  });
  
  logAction("EMP001", `Recalculated payroll drafts for month: ${month}`, "PAYROLL");
  res.json({ message: `Successfully computed payroll for ${generated.length} employees.`, payrolls: generated });
});

// Update payroll status (Process payment)
app.put("/api/payrolls/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const index = payrolls.findIndex(p => p.id === id);
  if (index !== -1) {
    payrolls[index].status = status as PayrollStatus;
    if (status === "PAID") {
      payrolls[index].processedDate = new Date().toISOString().split('T')[0];
    }
    logAction("EMP001", `Updated status of payroll ${id} to ${status}`, "PAYROLL");
    res.json(payrolls[index]);
  } else {
    res.status(404).json({ message: "Payroll record not found" });
  }
});

// Audit Activity Logs API
app.get("/api/audit-logs", (req, res) => {
  res.json(activityLogs);
});

// ==========================================
// Vite / Static Assets Serving Setup
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
