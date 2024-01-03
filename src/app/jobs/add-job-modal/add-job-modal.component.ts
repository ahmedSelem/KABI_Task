import { JobsService } from './../../core/services/jobs.service';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SubDestroyService } from '../../core/services/sub-destroy.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-job-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-job-modal.component.html',
  styleUrl: './add-job-modal.component.scss',
})
export class AddJobModalComponent implements OnInit {
  addForm!: FormGroup;
  sectorList: string[] = [];
  countryList: string[] = [];
  cityList: string[] = [];

  constructor(
    private _bsModalRef: BsModalService,
    private _jobsService: JobsService,
    private _destroy$: SubDestroyService
  ) {}

  ngOnInit(): void {
    this.addForm = new FormGroup({
      jobTitle: new FormControl(null, [Validators.required]),
      sector: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    });
    this.onFetchSectors();
    this.onFetchCountry();
    this.onFetchCity();
   
  }

  addJob() {
    this._jobsService.addNewJob(this.addForm.value);
    this.onClose();
  }
  

  onFetchSectors() {
    this._jobsService
      .fetchSectorList()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response) => {
          this.sectorList = response.sector;
          this.addForm.patchValue({
            sector: this.sectorList[0]
          });
        },
      });
  }

  onFetchCountry() {
    this._jobsService
      .fetchCountryList()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response) => {
          this.countryList = response.country;
          this.addForm.patchValue({
            country: this.countryList[0]
          });
        },
      });
  }

  onFetchCity() {
    this._jobsService
      .fetchCityList()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response) => {
          this.cityList = response.city;
          this.addForm.patchValue({
            city: this.cityList[0]
          });
        },
      });
  }

  onClose() {
    this._bsModalRef.hide();
  }
}
