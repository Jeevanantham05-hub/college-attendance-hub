import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Student } from '@/types/attendance';
import { Mail, Phone, Eye, Edit, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StudentCardProps {
  student: Student;
  attendancePercentage?: number;
}

export function StudentCard({ student, attendancePercentage = 85 }: StudentCardProps) {
  const navigate = useNavigate();

  return (
    <Card variant="stat" className="group">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="h-14 w-14 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground text-xl font-bold">
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className={cn(
              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card",
              student.status === 'active' ? 'bg-status-present' : 'bg-muted'
            )} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground truncate">{student.name}</h3>
                <p className="text-sm text-muted-foreground">{student.registerNumber}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/students/${student.id}`)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {student.department}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Year {student.year}
              </Badge>
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {student.email}
              </span>
            </div>

            {/* Attendance Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Attendance</span>
                <span className={cn(
                  "font-semibold",
                  attendancePercentage >= 75 ? "text-status-present" : "text-status-absent"
                )}>
                  {attendancePercentage}%
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    attendancePercentage >= 75 ? "bg-status-present" : "bg-status-absent"
                  )}
                  style={{ width: `${attendancePercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
