import { Routes } from '@angular/router';
import { Analytics } from './pages/analytics/analytics';
import { Calendar } from './pages/calendar/calendar';
import { Dashboard } from './pages/dashboard/dashboard';
import { Settings } from './pages/settings/settings';
import { Subscriptions } from './pages/subscriptions/subscriptions';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'analytics', component: Analytics },
  { path: 'calendar', component: Calendar },
  { path: 'settings', component: Settings },
  { path: 'subscriptions', component: Subscriptions },
];
