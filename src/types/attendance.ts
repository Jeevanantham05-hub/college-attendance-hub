export type UserRole = 'admin' | 'teacher' | 'student';

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'holiday';

export type StudentStatus = 'active' | 'inactive';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

export interface Student {
  id: string;
  registerNumber: string;
  name: string;
  department: string;
  year: number;
  semester: number;
  phone: string;
  email: string;
  address: string;
  parentContact: string;
  photo?: string;
  status: StudentStatus;
  createdAt: Date;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  markedBy: string;
  markedAt: Date;
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  description?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  holidayDays: number;
  percentage: number;
}

export interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  onLeave: number;
  isHoliday: boolean;
  holidayName?: string;
  monthlyPercentage: number;
}
