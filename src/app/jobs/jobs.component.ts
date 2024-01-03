import { Component } from '@angular/core';
import { AsideFilterComponent } from './aside-filter/aside-filter.component';
import { JobsItemsComponent } from './jobs-items/jobs-items.component';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [AsideFilterComponent, JobsItemsComponent, FormsModule],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
})
export class JobsComponent {

}
