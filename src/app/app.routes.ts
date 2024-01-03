import { Routes } from '@angular/router';

import { JobsComponent } from './jobs/jobs.component';

export const routes: Routes = [
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  { path: 'jobs', component: JobsComponent, title: 'Jobs' },
];
