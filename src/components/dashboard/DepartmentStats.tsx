import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getDepartmentStats } from '@/data/mockData';

export function DepartmentStats() {
  const stats = getDepartmentStats();

  return (
    <Card className="animate-slide-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
      <CardHeader>
        <CardTitle>Department-wise Attendance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {stats.map((dept, index) => (
          <div key={dept.code} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{dept.department}</span>
                <span className="text-xs text-muted-foreground">({dept.students} students)</span>
              </div>
              <span className="text-sm font-semibold">{dept.percentage}%</span>
            </div>
            <Progress 
              value={dept.percentage} 
              className="h-2"
              style={{
                ['--progress-background' as string]: dept.percentage >= 75 
                  ? 'hsl(var(--status-present))' 
                  : dept.percentage >= 50 
                    ? 'hsl(var(--status-holiday))' 
                    : 'hsl(var(--status-absent))',
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
