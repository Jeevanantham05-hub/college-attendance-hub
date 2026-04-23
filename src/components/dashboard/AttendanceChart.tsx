import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jul', attendance: 92 },
  { month: 'Aug', attendance: 88 },
  { month: 'Sep', attendance: 95 },
  { month: 'Oct', attendance: 85 },
  { month: 'Nov', attendance: 90 },
  { month: 'Dec', attendance: 87 },
];

export function AttendanceChart() {
  return (
    <Card className="animate-slide-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
      <CardHeader>
        <CardTitle>Monthly Attendance Percentage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(174 62% 47%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(174 62% 47%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(215 16% 47%)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(215 16% 47%)"
                fontSize={12}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(0 0% 100%)',
                  border: '1px solid hsl(214 32% 91%)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px hsl(222 47% 11% / 0.08)',
                }}
                formatter={(value: number) => [`${value}%`, 'Attendance']}
              />
              <Area
                type="monotone"
                dataKey="attendance"
                stroke="hsl(174 62% 47%)"
                strokeWidth={3}
                fill="url(#attendanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
