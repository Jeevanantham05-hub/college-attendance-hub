import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isWeekend,
} from 'date-fns';
import { AttendanceStatus } from '@/types/attendance';

interface AttendanceCalendarProps {
  attendanceData?: Record<string, AttendanceStatus>;
  onDateClick?: (date: Date) => void;
  selectedDate?: Date | null;
}

export function AttendanceCalendar({ attendanceData = {}, onDateClick, selectedDate }: AttendanceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDay = monthStart.getDay();
  const paddingDays = Array(startDay).fill(null);

  const statusConfig = {
    present: { color: 'bg-status-present text-status-present-light', icon: CheckCircle2 },
    absent: { color: 'bg-status-absent text-status-absent-light', icon: XCircle },
    leave: { color: 'bg-status-leave text-status-leave-light', icon: Clock },
    holiday: { color: 'bg-status-holiday text-status-holiday-light', icon: Calendar },
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">{format(currentMonth, 'MMMM yyyy')}</CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {paddingDays.map((_, index) => (
            <div key={`padding-${index}`} className="aspect-square" />
          ))}
          {days.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const status = attendanceData[dateKey];
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isWeekendDay = isWeekend(day);

            return (
              <button
                key={dateKey}
                onClick={() => onDateClick?.(day)}
                disabled={isWeekendDay}
                className={cn(
                  "aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all duration-200",
                  "hover:bg-muted/50",
                  isWeekendDay && "opacity-50 cursor-not-allowed bg-muted/30",
                  isToday && !status && "ring-2 ring-primary ring-offset-2",
                  isSelected && "ring-2 ring-secondary ring-offset-2",
                  status && statusConfig[status].color
                )}
              >
                <span className={cn(
                  "font-medium",
                  status && "text-inherit"
                )}>
                  {format(day, 'd')}
                </span>
                {status && (
                  <div className="mt-0.5">
                    {(() => {
                      const Icon = statusConfig[status].icon;
                      return <Icon className="h-3 w-3" />;
                    })()}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-4 border-t">
          {Object.entries(statusConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <div key={key} className="flex items-center gap-1.5">
                <div className={cn("w-3 h-3 rounded", config.color)} />
                <span className="text-xs text-muted-foreground capitalize">{key}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
