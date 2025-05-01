import { TaskWidgetComponent } from './task-widget/task-widget.component';

export type Widget = {
  id: string;
  title: string;
  component: any;
  size: 'small' | 'medium' | 'large' | 'tall';
  link: string;
  enabled: boolean;
};

export const dashboardWidgets: Widget[] = [
  { id: 'task', title: 'Todays Tasks', component: TaskWidgetComponent, size: 'large', link: '/task', enabled: true },
  { id: 'notification', title: 'Notifications', component: null, size: 'tall', link: '/notification', enabled: true },
  { id: 'habit', title: 'Habits', component: null, size: 'medium', link: '/habit', enabled: true },
  { id: 'event', title: 'Upcoming Events', component: null, size: 'large', link: '/event', enabled: true },
  { id: 'note', title: 'Recent Notes', component: null, size: 'tall', link: '/note', enabled: true },
  {
    id: 'productivity-report',
    title: 'Productivity Insights',
    component: null,
    size: 'large',
    link: '/productivity-report',
    enabled: true,
  },
  {
    id: 'pomodoro-session',
    title: 'Focus Timer',
    component: null,
    size: 'small',
    link: '/pomodoro-session',
    enabled: true,
  },
];
