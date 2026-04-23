import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { holidays as initialHolidays } from '@/data/mockData';
import { format, parseISO, isPast, isFuture } from 'date-fns';
import { Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Holiday } from '@/types/attendance';

export default function Holidays() {
  const [holidayList, setHolidayList] = useState<Holiday[]>(initialHolidays);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);

  const handleAddHoliday = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newHoliday: Holiday = {
      id: Date.now().toString(),
      date: formData.get('date') as string,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    };

    if (editingHoliday) {
      setHolidayList((prev) =>
        prev.map((h) => (h.id === editingHoliday.id ? { ...newHoliday, id: h.id } : h))
      );
      toast({
        title: 'Holiday Updated',
        description: `${newHoliday.name} has been updated.`,
      });
    } else {
      setHolidayList((prev) => [...prev, newHoliday]);
      toast({
        title: 'Holiday Added',
        description: `${newHoliday.name} has been added to the calendar.`,
      });
    }

    setIsDialogOpen(false);
    setEditingHoliday(null);
  };

  const handleDelete = (holiday: Holiday) => {
    setHolidayList((prev) => prev.filter((h) => h.id !== holiday.id));
    toast({
      title: 'Holiday Deleted',
      description: `${holiday.name} has been removed.`,
    });
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setIsDialogOpen(true);
  };

  const upcomingHolidays = holidayList
    .filter((h) => isFuture(parseISO(h.date)) || h.date === format(new Date(), 'yyyy-MM-dd'))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastHolidays = holidayList
    .filter((h) => isPast(parseISO(h.date)) && h.date !== format(new Date(), 'yyyy-MM-dd'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <DashboardLayout
      title="Government Holidays"
      subtitle="Manage holiday calendar for attendance tracking"
    >
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="bg-status-holiday-light border-status-holiday/20 animate-slide-up">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-xl bg-status-holiday/10 p-3">
              <Calendar className="h-6 w-6 text-status-holiday" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-status-holiday">
                {holidayList.length}
              </p>
              <p className="text-sm text-status-holiday/80">Total Holidays</p>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-xl bg-secondary/10 p-3">
              <Calendar className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-secondary">
                {upcomingHolidays.length}
              </p>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-xl bg-muted p-3">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-muted-foreground">
                {pastHolidays.length}
              </p>
              <p className="text-sm text-muted-foreground">Past</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Holiday Button */}
      <div className="flex justify-end mb-6">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingHoliday(null);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Holiday
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}</DialogTitle>
              <DialogDescription>
                {editingHoliday
                  ? 'Update the holiday details below.'
                  : 'Add a new government holiday to the calendar.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddHoliday} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Holiday Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Independence Day"
                  defaultValue={editingHoliday?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={editingHoliday?.date}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="e.g., National Holiday"
                  defaultValue={editingHoliday?.description}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingHoliday(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingHoliday ? 'Update Holiday' : 'Add Holiday'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming Holidays */}
      {upcomingHolidays.length > 0 && (
        <Card className="mb-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-holiday animate-pulse" />
              Upcoming Holidays
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Holiday Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingHolidays.map((holiday) => (
                  <TableRow key={holiday.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {format(parseISO(holiday.date), 'MMM d, yyyy')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{holiday.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {holiday.description || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(holiday)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(holiday)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Past Holidays */}
      {pastHolidays.length > 0 && (
        <Card className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">Past Holidays</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Holiday Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastHolidays.slice(0, 5).map((holiday) => (
                  <TableRow key={holiday.id} className="opacity-60">
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {format(parseISO(holiday.date), 'MMM d, yyyy')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{holiday.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {holiday.description || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(holiday)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
