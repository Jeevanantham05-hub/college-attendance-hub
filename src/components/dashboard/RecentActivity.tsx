import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const activities = [
  {
    id: 1,
    type: 'present',
    student: 'Rahul Sharma',
    action: 'marked present',
    time: '2 min ago',
    class: 'CS-2A',
  },
  {
    id: 2,
    type: 'absent',
    student: 'Priya Patel',
    action: 'marked absent',
    time: '5 min ago',
    class: 'CS-2A',
  },
  {
    id: 3,
    type: 'leave',
    student: 'Amit Kumar',
    action: 'applied for leave',
    time: '1 hour ago',
    class: 'ECE-3B',
  },
  {
    id: 4,
    type: 'holiday',
    student: 'System',
    action: 'added Christmas holiday',
    time: '2 hours ago',
    class: 'All',
  },
];

const typeConfig = {
  present: {
    icon: CheckCircle2,
    color: 'text-status-present',
    bg: 'bg-status-present-light',
  },
  absent: {
    icon: XCircle,
    color: 'text-status-absent',
    bg: 'bg-status-absent-light',
  },
  leave: {
    icon: Clock,
    color: 'text-status-leave',
    bg: 'bg-status-leave-light',
  },
  holiday: {
    icon: Calendar,
    color: 'text-status-holiday',
    bg: 'bg-status-holiday-light',
  },
};

export function RecentActivity() {
  return (
    <Card className="animate-slide-up opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const config = typeConfig[activity.type as keyof typeof typeConfig];
            const Icon = config.icon;
            
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                <div className={cn("rounded-full p-2", config.bg)}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    <span className="text-foreground">{activity.student}</span>
                    {' '}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {activity.class}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
