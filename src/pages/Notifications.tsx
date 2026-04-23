import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
  Send,
  Settings,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const notifications = [
  {
    id: '1',
    type: 'alert',
    title: 'Low Attendance Warning',
    message: 'Rahul Sharma (CS2024001) has attendance below 75%',
    time: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: '2',
    type: 'success',
    title: 'Report Generated',
    message: 'Monthly attendance report for November is ready',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Holiday Reminder',
    message: 'Christmas holiday on December 25th',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
  {
    id: '4',
    type: 'alert',
    title: 'Multiple Students Alert',
    message: '5 students in ECE-3B have attendance below threshold',
    time: new Date(Date.now() - 1000 * 60 * 60 * 48),
    read: true,
  },
];

const typeConfig = {
  alert: {
    icon: AlertTriangle,
    color: 'text-status-absent',
    bg: 'bg-status-absent-light',
  },
  success: {
    icon: CheckCircle2,
    color: 'text-status-present',
    bg: 'bg-status-present-light',
  },
  info: {
    icon: Clock,
    color: 'text-status-leave',
    bg: 'bg-status-leave-light',
  },
};

export default function Notifications() {
  const [notificationList, setNotificationList] = useState(notifications);
  const [settings, setSettings] = useState({
    lowAttendanceAlert: true,
    monthlyReport: true,
    holidayReminder: true,
    emailNotifications: false,
    threshold: '75',
  });

  const unreadCount = notificationList.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotificationList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({
      title: 'Notifications Updated',
      description: 'All notifications marked as read.',
    });
  };

  const handleDelete = (id: string) => {
    setNotificationList((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSendNotification = () => {
    toast({
      title: 'Notification Sent',
      description: 'Low attendance alerts have been sent to students and parents.',
    });
  };

  return (
    <DashboardLayout
      title="Notifications"
      subtitle="Manage alerts and communication"
    >
      <Tabs defaultValue="inbox" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="inbox" className="relative">
            Inbox
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-status-absent text-status-absent-light text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="send">Send Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Inbox Tab */}
        <TabsContent value="inbox" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Notifications</h3>
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              Mark all as read
            </Button>
          </div>

          <div className="space-y-3">
            {notificationList.map((notification, index) => {
              const config = typeConfig[notification.type as keyof typeof typeConfig];
              const Icon = config.icon;

              return (
                <Card
                  key={notification.id}
                  className={cn(
                    'animate-slide-up transition-all duration-200',
                    !notification.read && 'border-l-4 border-l-primary'
                  )}
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards', opacity: 0 }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn('rounded-full p-2', config.bg)}>
                        <Icon className={cn('h-4 w-4', config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={cn('font-medium', !notification.read && 'text-foreground')}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs text-muted-foreground">
                            {format(notification.time, 'MMM d, h:mm a')}
                          </span>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-destructive hover:text-destructive"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Send Alerts Tab */}
        <TabsContent value="send" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards', opacity: 0 }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-status-absent" />
                  Low Attendance Alert
                </CardTitle>
                <CardDescription>
                  Send alerts to students and parents with attendance below threshold
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-status-absent-light rounded-lg">
                    <div>
                      <p className="font-medium text-status-absent">8 students</p>
                      <p className="text-sm text-status-absent/80">Below 75% attendance</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-status-absent" />
                  </div>
                  <Button className="w-full" onClick={handleSendNotification}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Alert to All
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards', opacity: 0 }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-secondary" />
                  Monthly Performance Email
                </CardTitle>
                <CardDescription>
                  Send monthly attendance summary to all students and parents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                    <div>
                      <p className="font-medium text-secondary">December Report</p>
                      <p className="text-sm text-muted-foreground">Ready to send</p>
                    </div>
                    <Mail className="h-8 w-8 text-secondary" />
                  </div>
                  <Button variant="secondary" className="w-full" onClick={() => {
                    toast({
                      title: 'Emails Sent',
                      description: 'Monthly performance emails have been sent.',
                    });
                  }}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Monthly Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards', opacity: 0 }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Attendance Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when students fall below attendance threshold
                  </p>
                </div>
                <Switch
                  checked={settings.lowAttendanceAlert}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, lowAttendanceAlert: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Monthly Report Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Reminder to send monthly attendance reports
                  </p>
                </div>
                <Switch
                  checked={settings.monthlyReport}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, monthlyReport: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Holiday Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about upcoming holidays
                  </p>
                </div>
                <Switch
                  checked={settings.holidayReminder}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, holidayReminder: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Attendance Threshold (%)</Label>
                <Input
                  type="number"
                  value={settings.threshold}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, threshold: e.target.value }))
                  }
                  className="w-32"
                  min="0"
                  max="100"
                />
                <p className="text-sm text-muted-foreground">
                  Students below this percentage will trigger alerts
                </p>
              </div>

              <Button onClick={() => {
                toast({
                  title: 'Settings Saved',
                  description: 'Your notification preferences have been updated.',
                });
              }}>
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
