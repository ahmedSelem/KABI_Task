import { Component } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { jobInterface } from '../../core/interfaces/job-interface';

@Component({
  selector: 'app-details-job-modal',
  standalone: true,
  imports: [],
  templateUrl: './details-job-modal.component.html',
  styleUrl: './details-job-modal.component.scss',
})
export class DetailsJobModalComponent {
  jobObj!: jobInterface;

  constructor(private _bsModalRef: BsModalService) {}

  onClose() {
    this._bsModalRef.hide();
  }
}
