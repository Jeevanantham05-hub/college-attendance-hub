import { ReactNode, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'present' | 'absent' | 'leave' | 'holiday';
  delay?: number;
}

export function StatCard({ title, value, icon, trend, variant = 'default', delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const duration = 1000;
      const increment = value / (duration / 16);
      
      const counter = setInterval(() => {
        start += increment;
        if (start >= value) {
          setDisplayValue(value);
          clearInterval(counter);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  const variants = {
    default: 'bg-card border-border',
    present: 'bg-status-present-light border-status-present/20',
    absent: 'bg-status-absent-light border-status-absent/20',
    leave: 'bg-status-leave-light border-status-leave/20',
    holiday: 'bg-status-holiday-light border-status-holiday/20',
  };

  const iconVariants = {
    default: 'bg-primary/10 text-primary',
    present: 'bg-status-present/10 text-status-present',
    absent: 'bg-status-absent/10 text-status-absent',
    leave: 'bg-status-leave/10 text-status-leave',
    holiday: 'bg-status-holiday/10 text-status-holiday',
  };

  const textVariants = {
    default: 'text-foreground',
    present: 'text-status-present',
    absent: 'text-status-absent',
    leave: 'text-status-leave',
    holiday: 'text-status-holiday',
  };

  return (
    <Card
      variant="stat"
      className={cn(
        "animate-slide-up opacity-0",
        variants[variant]
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn("text-4xl font-bold font-display", textVariants[variant])}>
              {displayValue}
            </p>
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                <span className={trend.isPositive ? "text-status-present" : "text-status-absent"}>
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className={cn("rounded-xl p-3", iconVariants[variant])}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
