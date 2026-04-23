import { Student, AttendanceRecord, Holiday, Department, DashboardStats, AttendanceStatus } from '@/types/attendance';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from 'date-fns';

export const departments: Department[] = [
  { id: '1', name: 'Computer Science', code: 'CS' },
  { id: '2', name: 'Electronics', code: 'ECE' },
  { id: '3', name: 'Mechanical', code: 'ME' },
  { id: '4', name: 'Civil', code: 'CE' },
  { id: '5', name: 'Electrical', code: 'EE' },
];

export const students: Student[] = [
  {
    id: '1',
    registerNumber: 'CS2024001',
    name: 'Rahul Sharma',
    department: 'Computer Science',
    year: 2,
    semester: 3,
    phone: '+91 9876543210',
    email: 'rahul.sharma@college.edu',
    address: '123, MG Road, Bangalore',
    parentContact: '+91 9876543211',
    status: 'active',
    createdAt: new Date('2024-06-15'),
  },
  {
    id: '2',
    registerNumber: 'CS2024002',
    name: 'Priya Patel',
    department: 'Computer Science',
    year: 2,
    semester: 3,
    phone: '+91 9876543212',
    email: 'priya.patel@college.edu',
    address: '456, Koramangala, Bangalore',
    parentContact: '+91 9876543213',
    status: 'active',
    createdAt: new Date('2024-06-15'),
  },
  {
    id: '3',
    registerNumber: 'ECE2024001',
    name: 'Amit Kumar',
    department: 'Electronics',
    year: 3,
    semester: 5,
    phone: '+91 9876543214',
    email: 'amit.kumar@college.edu',
    address: '789, Indiranagar, Bangalore',
    parentContact: '+91 9876543215',
    status: 'active',
    createdAt: new Date('2023-06-15'),
  },
  {
    id: '4',
    registerNumber: 'ME2024001',
    name: 'Sneha Reddy',
    department: 'Mechanical',
    year: 1,
    semester: 1,
    phone: '+91 9876543216',
    email: 'sneha.reddy@college.edu',
    address: '101, HSR Layout, Bangalore',
    parentContact: '+91 9876543217',
    status: 'active',
    createdAt: new Date('2024-06-15'),
  },
  {
    id: '5',
    registerNumber: 'CS2024003',
    name: 'Vikram Singh',
    department: 'Computer Science',
    year: 2,
    semester: 3,
    phone: '+91 9876543218',
    email: 'vikram.singh@college.edu',
    address: '202, Whitefield, Bangalore',
    parentContact: '+91 9876543219',
    status: 'active',
    createdAt: new Date('2024-06-15'),
  },
  {
    id: '6',
    registerNumber: 'CE2024001',
    name: 'Ananya Gupta',
    department: 'Civil',
    year: 4,
    semester: 7,
    phone: '+91 9876543220',
    email: 'ananya.gupta@college.edu',
    address: '303, Electronic City, Bangalore',
    parentContact: '+91 9876543221',
    status: 'active',
    createdAt: new Date('2021-06-15'),
  },
  {
    id: '7',
    registerNumber: 'EE2024001',
    name: 'Karthik Nair',
    department: 'Electrical',
    year: 3,
    semester: 5,
    phone: '+91 9876543222',
    email: 'karthik.nair@college.edu',
    address: '404, JP Nagar, Bangalore',
    parentContact: '+91 9876543223',
    status: 'active',
    createdAt: new Date('2023-06-15'),
  },
  {
    id: '8',
    registerNumber: 'CS2024004',
    name: 'Meera Iyer',
    department: 'Computer Science',
    year: 2,
    semester: 3,
    phone: '+91 9876543224',
    email: 'meera.iyer@college.edu',
    address: '505, Marathahalli, Bangalore',
    parentContact: '+91 9876543225',
    status: 'inactive',
    createdAt: new Date('2024-06-15'),
  },
];

export const holidays: Holiday[] = [
  { id: '1', date: '2024-01-26', name: 'Republic Day', description: 'National Holiday' },
  { id: '2', date: '2024-03-25', name: 'Holi', description: 'Festival of Colors' },
  { id: '3', date: '2024-04-14', name: 'Ambedkar Jayanti', description: 'National Holiday' },
  { id: '4', date: '2024-05-01', name: 'May Day', description: 'Labour Day' },
  { id: '5', date: '2024-08-15', name: 'Independence Day', description: 'National Holiday' },
  { id: '6', date: '2024-10-02', name: 'Gandhi Jayanti', description: 'National Holiday' },
  { id: '7', date: '2024-10-31', name: 'Diwali', description: 'Festival of Lights' },
  { id: '8', date: '2024-11-01', name: 'Diwali Holiday', description: 'Festival Holiday' },
  { id: '9', date: '2024-12-25', name: 'Christmas', description: 'Festival Holiday' },
];

// Generate attendance records for the past 30 days
export function generateAttendanceRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  students.forEach(student => {
    for (let i = 0; i < 30; i++) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Check if it's a holiday
      const isHoliday = holidays.some(h => h.date === dateStr);
      const isWeekendDay = isWeekend(date);
      
      if (isWeekendDay) continue;
      
      let status: AttendanceStatus;
      if (isHoliday) {
        status = 'holiday';
      } else {
        // Random attendance with 85% present rate
        const rand = Math.random();
        if (rand < 0.85) status = 'present';
        else if (rand < 0.95) status = 'absent';
        else status = 'leave';
      }
      
      records.push({
        id: `${student.id}-${dateStr}`,
        studentId: student.id,
        date: dateStr,
        status,
        markedBy: 'teacher@college.edu',
        markedAt: date,
      });
    }
  });
  
  return records;
}

export const attendanceRecords = generateAttendanceRecords();

export function getDashboardStats(): DashboardStats {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayRecords = attendanceRecords.filter(r => r.date === today);
  const holidayToday = holidays.find(h => h.date === today);
  
  const activeStudents = students.filter(s => s.status === 'active');
  
  // Calculate monthly percentage
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
    .filter(d => !isWeekend(d) && !holidays.some(h => h.date === format(d, 'yyyy-MM-dd')));
  
  const totalPossibleDays = monthDays.length * activeStudents.length;
  const presentDays = attendanceRecords.filter(
    r => r.status === 'present' && 
    new Date(r.date) >= monthStart && 
    new Date(r.date) <= new Date()
  ).length;
  
  return {
    totalStudents: activeStudents.length,
    presentToday: todayRecords.filter(r => r.status === 'present').length,
    absentToday: todayRecords.filter(r => r.status === 'absent').length,
    onLeave: todayRecords.filter(r => r.status === 'leave').length,
    isHoliday: !!holidayToday,
    holidayName: holidayToday?.name,
    monthlyPercentage: totalPossibleDays > 0 ? Math.round((presentDays / totalPossibleDays) * 100) : 0,
  };
}

export function getStudentAttendanceSummary(studentId: string): {
  summary: { month: string; percentage: number }[];
  overall: { present: number; absent: number; leave: number; holiday: number; percentage: number };
} {
  const studentRecords = attendanceRecords.filter(r => r.studentId === studentId);
  
  const overall = {
    present: studentRecords.filter(r => r.status === 'present').length,
    absent: studentRecords.filter(r => r.status === 'absent').length,
    leave: studentRecords.filter(r => r.status === 'leave').length,
    holiday: studentRecords.filter(r => r.status === 'holiday').length,
    percentage: 0,
  };
  
  const workingDays = overall.present + overall.absent + overall.leave;
  overall.percentage = workingDays > 0 ? Math.round((overall.present / workingDays) * 100) : 0;
  
  // Generate monthly data
  const summary = [
    { month: 'Jul', percentage: 92 },
    { month: 'Aug', percentage: 88 },
    { month: 'Sep', percentage: 95 },
    { month: 'Oct', percentage: 85 },
    { month: 'Nov', percentage: 90 },
    { month: 'Dec', percentage: overall.percentage },
  ];
  
  return { summary, overall };
}

export function getDepartmentStats() {
  return departments.map(dept => {
    const deptStudents = students.filter(s => s.department === dept.name && s.status === 'active');
    const deptRecords = attendanceRecords.filter(r => 
      deptStudents.some(s => s.id === r.studentId) && r.status === 'present'
    );
    
    const totalDays = deptStudents.length * 20; // Assuming 20 working days
    const percentage = totalDays > 0 ? Math.round((deptRecords.length / totalDays) * 100) : 0;
    
    return {
      department: dept.name,
      code: dept.code,
      students: deptStudents.length,
      percentage: Math.min(percentage, 100),
    };
  });
}
