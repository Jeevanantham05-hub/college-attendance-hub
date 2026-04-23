import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';
import { DepartmentStats } from '@/components/dashboard/DepartmentStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { getDashboardStats } from '@/data/mockData';
import { Users, UserCheck, UserX, Clock, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const stats = getDashboardStats();

  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back! Here's your attendance overview.">
      {/* Holiday Banner */}
      {stats.isHoliday && (
        <Card className="mb-6 bg-status-holiday-light border-status-holiday/20 animate-slide-up">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-status-holiday/10 p-2">
              <Calendar className="h-5 w-5 text-status-holiday" />
            </div>
            <div>
              <p className="font-semibold text-status-holiday">Today is a Holiday</p>
              <p className="text-sm text-status-holiday/80">{stats.holidayName}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 5, isPositive: true }}
          delay={0}
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon={<UserCheck className="h-6 w-6" />}
          variant="present"
          delay={100}
        />
        <StatCard
          title="Absent Today"
          value={stats.absentToday}
          icon={<UserX className="h-6 w-6" />}
          variant="absent"
          delay={200}
        />
        <StatCard
          title="On Leave"
          value={stats.onLeave}
          icon={<Clock className="h-6 w-6" />}
          variant="leave"
          delay={300}
        />
      </div>

      {/* Monthly Percentage Card */}
      <Card className="mb-6 animate-slide-up opacity-0" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-secondary/10 p-4">
              <TrendingUp className="h-8 w-8 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Attendance Rate</p>
              <p className="text-4xl font-bold font-display text-secondary">
                {stats.monthlyPercentage}%
              </p>
            </div>
          </div>
          <Badge variant={stats.monthlyPercentage >= 75 ? 'default' : 'destructive'} className="text-lg px-4 py-2">
            {stats.monthlyPercentage >= 75 ? 'On Track' : 'Needs Attention'}
          </Badge>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <AttendanceChart />
        <DepartmentStats />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </DashboardLayout>
  );
}
