import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { departments, getDepartmentStats, students } from '@/data/mockData';
import { FileText, Download, BarChart3, Users, TrendingUp, PieChart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const reportTypes = [
  {
    id: 'class',
    title: 'Class-wise Report',
    description: 'Attendance breakdown by class and department',
    icon: Users,
  },
  {
    id: 'monthly',
    title: 'Monthly Report',
    description: 'Month-over-month attendance analysis',
    icon: BarChart3,
  },
  {
    id: 'student',
    title: 'Student Export',
    description: 'Export individual student attendance data',
    icon: FileText,
  },
  {
    id: 'comparison',
    title: 'Comparison Report',
    description: 'Compare attendance across departments',
    icon: TrendingUp,
  },
];

const COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b'];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('class');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('december');

  const departmentStats = getDepartmentStats();

  const handleExport = (format: 'pdf' | 'excel') => {
    toast({
      title: 'Export Started',
      description: `Your ${format.toUpperCase()} report is being generated.`,
    });
  };

  // Pie chart data for attendance distribution
  const pieData = [
    { name: 'Present', value: 75 },
    { name: 'Absent', value: 15 },
    { name: 'Leave', value: 7 },
    { name: 'Holiday', value: 3 },
  ];

  // Monthly comparison data
  const monthlyData = [
    { month: 'Jul', CS: 92, ECE: 88, ME: 85, CE: 90, EE: 87 },
    { month: 'Aug', CS: 88, ECE: 90, ME: 82, CE: 88, EE: 85 },
    { month: 'Sep', CS: 95, ECE: 92, ME: 88, CE: 91, EE: 90 },
    { month: 'Oct', CS: 85, ECE: 87, ME: 84, CE: 86, EE: 83 },
    { month: 'Nov', CS: 90, ECE: 89, ME: 87, CE: 89, EE: 88 },
    { month: 'Dec', CS: 87, ECE: 86, ME: 85, CE: 87, EE: 86 },
  ];

  return (
    <DashboardLayout
      title="Reports"
      subtitle="Generate and export attendance reports"
    >
      {/* Report Type Selection */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {reportTypes.map((report, index) => (
          <Card
            key={report.id}
            className={`cursor-pointer transition-all duration-200 animate-slide-up ${
              selectedReport === report.id
                ? 'ring-2 ring-primary border-primary'
                : 'hover:border-primary/50'
            }`}
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards', opacity: 0 }}
            onClick={() => setSelectedReport(report.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`rounded-lg p-2 ${
                  selectedReport === report.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <report.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{report.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6 animate-slide-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards', opacity: 0 }}>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.code}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="december">December 2024</SelectItem>
                <SelectItem value="november">November 2024</SelectItem>
                <SelectItem value="october">October 2024</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" onClick={() => handleExport('excel')}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button onClick={() => handleExport('pdf')}>
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Stats Chart */}
        <Card className="animate-slide-up" style={{ animationDelay: '500ms', animationFillMode: 'forwards', opacity: 0 }}>
          <CardHeader>
            <CardTitle className="text-lg">Department-wise Attendance</CardTitle>
            <CardDescription>Attendance percentage by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    stroke="hsl(215 16% 47%)"
                    fontSize={12}
                  />
                  <YAxis
                    type="category"
                    dataKey="code"
                    stroke="hsl(215 16% 47%)"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(0 0% 100%)',
                      border: '1px solid hsl(214 32% 91%)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Attendance']}
                  />
                  <Bar dataKey="percentage" fill="hsl(174 62% 47%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Distribution Pie Chart */}
        <Card className="animate-slide-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards', opacity: 0 }}>
          <CardHeader>
            <CardTitle className="text-lg">Attendance Distribution</CardTitle>
            <CardDescription>Overall status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(0 0% 100%)',
                      border: '1px solid hsl(214 32% 91%)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Percentage']}
                  />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Comparison */}
        <Card className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '700ms', animationFillMode: 'forwards', opacity: 0 }}>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Comparison by Department</CardTitle>
            <CardDescription>Track attendance trends across departments over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                  <XAxis dataKey="month" stroke="hsl(215 16% 47%)" fontSize={12} />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    stroke="hsl(215 16% 47%)"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(0 0% 100%)',
                      border: '1px solid hsl(214 32% 91%)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}%`]}
                  />
                  <Legend />
                  <Bar dataKey="CS" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ECE" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ME" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="CE" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="EE" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Attendance Alert */}
      <Card className="mt-6 bg-status-absent-light border-status-absent/20 animate-slide-up" style={{ animationDelay: '800ms', animationFillMode: 'forwards', opacity: 0 }}>
        <CardHeader>
          <CardTitle className="text-lg text-status-absent">Low Attendance Alert</CardTitle>
          <CardDescription className="text-status-absent/80">
            Students with attendance below 75%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {students.slice(0, 3).map((student) => (
              <Badge key={student.id} variant="outline" className="border-status-absent text-status-absent">
                {student.name} ({student.registerNumber}) - 68%
              </Badge>
            ))}
            <Badge variant="secondary">+5 more students</Badge>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
