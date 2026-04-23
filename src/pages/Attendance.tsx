import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { students, departments, holidays } from '@/data/mockData';
import { format } from 'date-fns';
import { Calendar, CheckCircle2, XCircle, Clock, Save, FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { AttendanceStatus } from '@/types/attendance';

interface StudentAttendance {
  studentId: string;
  status: AttendanceStatus;
}

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});
  const [bulkSelect, setBulkSelect] = useState<AttendanceStatus | null>(null);

  const isHoliday = holidays.some((h) => h.date === selectedDate);
  const holidayInfo = holidays.find((h) => h.date === selectedDate);

  const filteredStudents = students.filter(
    (s) =>
      s.status === 'active' &&
      (selectedDepartment === 'all' || s.department === selectedDepartment)
  );

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleBulkMark = (status: AttendanceStatus) => {
    const newData: Record<string, AttendanceStatus> = {};
    filteredStudents.forEach((student) => {
      newData[student.id] = status;
    });
    setAttendanceData(newData);
    setBulkSelect(status);
    toast({
      title: 'Bulk Update',
      description: `All students marked as ${status}`,
    });
  };

  const handleSave = () => {
    toast({
      title: 'Attendance Saved',
      description: `Attendance for ${format(new Date(selectedDate), 'MMMM d, yyyy')} has been saved.`,
    });
  };

  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: 'Attendance data is being exported to Excel.',
    });
  };

  const statusButtons = [
    { status: 'present' as AttendanceStatus, icon: CheckCircle2, label: 'P', color: 'bg-status-present text-status-present-light' },
    { status: 'absent' as AttendanceStatus, icon: XCircle, label: 'A', color: 'bg-status-absent text-status-absent-light' },
    { status: 'leave' as AttendanceStatus, icon: Clock, label: 'L', color: 'bg-status-leave text-status-leave-light' },
  ];

  return (
    <DashboardLayout title="Mark Attendance" subtitle="Record daily student attendance">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          />
        </div>

        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.name}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Holiday Notice */}
      {isHoliday && (
        <Card className="mb-6 bg-status-holiday-light border-status-holiday/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-status-holiday" />
            <div>
              <p className="font-semibold text-status-holiday">Government Holiday: {holidayInfo?.name}</p>
              <p className="text-sm text-status-holiday/80">Attendance is auto-marked as holiday for all students.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Mark all as:</span>
            {statusButtons.map((btn) => (
              <Button
                key={btn.status}
                variant={bulkSelect === btn.status ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleBulkMark(btn.status)}
                className={bulkSelect === btn.status ? btn.color : ''}
                disabled={isHoliday}
              >
                <btn.icon className="h-4 w-4 mr-1" />
                {btn.status.charAt(0).toUpperCase() + btn.status.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Reg. No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student, index) => {
                const currentStatus = isHoliday ? 'holiday' : attendanceData[student.id];
                return (
                  <TableRow
                    key={student.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <TableCell className="font-mono text-sm">
                      {student.registerNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {student.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.department}</Badge>
                    </TableCell>
                    <TableCell>Year {student.year}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        {isHoliday ? (
                          <Badge className="bg-status-holiday text-status-holiday-light">
                            Holiday
                          </Badge>
                        ) : (
                          statusButtons.map((btn) => (
                            <button
                              key={btn.status}
                              onClick={() => handleStatusChange(student.id, btn.status)}
                              className={cn(
                                'h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-200',
                                currentStatus === btn.status
                                  ? btn.color
                                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                              )}
                            >
                              <btn.icon className="h-4 w-4" />
                            </button>
                          ))
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <Card className="bg-status-present-light border-status-present/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-status-present">
              {Object.values(attendanceData).filter((s) => s === 'present').length}
            </p>
            <p className="text-sm text-status-present/80">Present</p>
          </CardContent>
        </Card>
        <Card className="bg-status-absent-light border-status-absent/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-status-absent">
              {Object.values(attendanceData).filter((s) => s === 'absent').length}
            </p>
            <p className="text-sm text-status-absent/80">Absent</p>
          </CardContent>
        </Card>
        <Card className="bg-status-leave-light border-status-leave/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-status-leave">
              {Object.values(attendanceData).filter((s) => s === 'leave').length}
            </p>
            <p className="text-sm text-status-leave/80">On Leave</p>
          </CardContent>
        </Card>
        <Card className="bg-muted">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">
              {filteredStudents.length - Object.keys(attendanceData).length}
            </p>
            <p className="text-sm text-muted-foreground">Unmarked</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
