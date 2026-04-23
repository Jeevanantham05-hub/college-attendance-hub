import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { GraduationCap, Shield, BookOpen, User, Loader2 } from 'lucide-react';
import { UserRole } from '@/types/attendance';
import { cn } from '@/lib/utils';

const roleConfig = {
  admin: {
    icon: Shield,
    title: 'Administrator',
    description: 'Full system access',
    email: 'admin@college.edu',
    gradient: 'from-primary to-primary/80',
  },
  teacher: {
    icon: BookOpen,
    title: 'Teacher',
    description: 'Manage attendance',
    email: 'teacher@college.edu',
    gradient: 'from-secondary to-secondary/80',
  },
  student: {
    icon: User,
    title: 'Student',
    description: 'View your attendance',
    email: 'student@college.edu',
    gradient: 'from-status-present to-status-present/80',
  },
};

export default function Login() {
  const [role, setRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password, role);
    
    if (success) {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      navigate(role === 'student' ? '/profile' : '/dashboard');
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid credentials. Try using the demo credentials shown below.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  const fillDemoCredentials = (selectedRole: UserRole) => {
    setEmail(roleConfig[selectedRole].email);
    setPassword('password123');
    setRole(selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="relative w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-card/10 backdrop-blur-sm mb-4">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary-foreground">
            EduTrack
          </h1>
          <p className="text-primary-foreground/70 mt-1">
            College Attendance Management System
          </p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>
              Choose your role and enter your credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role Selection */}
            <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)} className="mb-6">
              <TabsList className="grid grid-cols-3 h-auto p-1">
                {(Object.keys(roleConfig) as UserRole[]).map((r) => {
                  const config = roleConfig[r];
                  const Icon = config.icon;
                  return (
                    <TabsTrigger
                      key={r}
                      value={r}
                      className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{config.title}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-center text-muted-foreground mb-3">
                Demo Credentials (click to fill)
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(roleConfig) as UserRole[]).map((r) => (
                  <Button
                    key={r}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => fillDemoCredentials(r)}
                  >
                    {roleConfig[r].title}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-primary-foreground/50 text-sm mt-6">
          © 2024 EduTrack. All rights reserved.
        </p>
      </div>
    </div>
  );
}
