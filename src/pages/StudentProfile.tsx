import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AttendanceCalendar } from '@/components/attendance/AttendanceCalendar';
import { students, getStudentAttendanceSummary, attendanceRecords } from '@/data/mockData';
import { format } from 'date-fns';
import {
  Mail,
  Phone,
  MapPin,
  Users,
  GraduationCap,
  Calendar,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AttendanceStatus } from '@/types/attendance';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  
  // For student role, show their own profile
  const studentId = user?.role === 'student' ? '1' : id;
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return (
      <DashboardLayout title="Student Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">The requested student profile was not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  const { summary, overall } = getStudentAttendanceSummary(student.id);

  // Build attendance data for calendar
  const calendarData: Record<string, AttendanceStatus> = {};
  attendanceRecords
    .filter((r) => r.studentId === student.id)
    .forEach((r) => {
      calendarData[r.date] = r.status;
    });

  const statCards = [
    {
      title: 'Present Days',
      value: overall.present,
      icon: CheckCircle2,
      color: 'text-status-present',
      bg: 'bg-status-present-light',
    },
    {
      title: 'Absent Days',
      value: overall.absent,
      icon: XCircle,
      color: 'text-status-absent',
      bg: 'bg-status-absent-light',
    },
    {
      title: 'Leave Days',
      value: overall.leave,
      icon: Clock,
      color: 'text-status-leave',
      bg: 'bg-status-leave-light',
    },
    {
      title: 'Holidays',
      value: overall.holiday,
      icon: Calendar,
      color: 'text-status-holiday',
      bg: 'bg-status-holiday-light',
    },
  ];

  return (
    <DashboardLayout
      title={user?.role === 'student' ? 'My Profile' : 'Student Profile'}
      subtitle={student.name}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1 animate-slide-up">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="mx-auto h-24 w-24 rounded-2xl bg-gradient-hero flex items-center justify-center text-primary-foreground text-3xl font-bold mb-4">
                {student.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <h2 className="text-xl font-bold font-display">{student.name}</h2>
              <p className="text-muted-foreground">{student.registerNumber}</p>
              <Badge
                className={cn(
                  'mt-2',
                  student.status === 'active'
                    ? 'bg-status-present text-status-present-light'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {student.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>{student.department}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Year {student.year} • Semester {student.semester}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{student.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Parent: {student.parentContact}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats and Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overall Attendance */}
          <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Overall Attendance</CardTitle>
                <div className="flex items-center gap-2">
                  <TrendingUp className={cn(
                    "h-5 w-5",
                    overall.percentage >= 75 ? "text-status-present" : "text-status-absent"
                  )} />
                  <span className={cn(
                    "text-3xl font-bold font-display",
                    overall.percentage >= 75 ? "text-status-present" : "text-status-absent"
                  )}>
                    {overall.percentage}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress
                value={overall.percentage}
                className="h-3"
                style={{
                  ['--progress-background' as string]:
                    overall.percentage >= 75
                      ? 'hsl(var(--status-present))'
                      : 'hsl(var(--status-absent))',
                }}
              />
              {overall.percentage < 75 && (
                <p className="text-sm text-status-absent mt-2">
                  ⚠️ Attendance below 75%. Please improve attendance to avoid academic issues.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
              <Card
                key={stat.title}
                className={cn('animate-slide-up', stat.bg)}
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <CardContent className="p-4 text-center">
                  <stat.icon className={cn('h-6 w-6 mx-auto mb-2', stat.color)} />
                  <p className={cn('text-2xl font-bold font-display', stat.color)}>
                    {stat.value}
                  </p>
                  <p className={cn('text-xs', stat.color)}>{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Monthly Chart */}
          <Card className="animate-slide-up" style={{ animationDelay: '600ms' }}>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                    <XAxis dataKey="month" stroke="hsl(215 16% 47%)" fontSize={12} />
                    <YAxis
                      stroke="hsl(215 16% 47%)"
                      fontSize={12}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(0 0% 100%)',
                        border: '1px solid hsl(214 32% 91%)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value}%`, 'Attendance']}
                    />
                    <Bar
                      dataKey="percentage"
                      fill="hsl(174 62% 47%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Attendance Calendar */}
      <div className="mt-6 animate-slide-up" style={{ animationDelay: '700ms' }}>
        <AttendanceCalendar attendanceData={calendarData} />
      </div>
    </DashboardLayout>
  );
}
