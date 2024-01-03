import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';

import { JobsService } from '../../core/services/jobs.service';
import { SubDestroyService } from '../../core/services/sub-destroy.service';

@Component({
  selector: 'app-aside-filter',
  standalone: true,
  imports: [],
  templateUrl: './aside-filter.component.html',
  styleUrl: './aside-filter.component.scss',
})
export class AsideFilterComponent implements OnInit {
  sectorList: string[] = [];
  countryList: string[] = [];
  cityList: string[] = [];
  selectedCountry: string[] = [];
  selectedCity: string[] = [];
  selectedSector: string[] = [];

  constructor(
    public _jobsService: JobsService,
    private _destroy$: SubDestroyService
  ) {}

  ngOnInit(): void {
    this.onFetchSectors();
    this.onFetchCountry();
    this.onFetchCity();
  }

  onFetchSectors() {
    this._jobsService
      .fetchSectorList()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response) => {
          this.sectorList = response.sector;
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
        },
      });
  }

  onCheckboxChange(list: string[], index: number, prefix: string, type: string) {
    const isChecked = this.isCheckboxChecked(prefix, index);
    const selectedList = this.getListByType(type);
  
    if (!isChecked) {
      const selectedIndex = selectedList.indexOf(list[index]);
      if (selectedIndex !== -1) {
        selectedList.splice(selectedIndex, 1);
      }
    } else {
      selectedList.push(list[index]);
    }
  
    this.setListByType(type, selectedList);
    this._jobsService.fetchjobsList().subscribe((jobs) => {
      console.log(jobs);
    });
  }
  
  getListByType(type: string): string[] {
    switch (type) {
      case 'country':
        return this.selectedCountry;
      case 'city':
        return this.selectedCity;
      case 'sector':
        return this.selectedSector;
      default:
        return [];
    }
  }
  
  setListByType(type: string, updatedList: string[]): void {
    switch (type) {
      case 'country':
        this._jobsService.countryListFilter.next(updatedList);
        break;
      case 'city':
        this._jobsService.cityListFilter.next(updatedList);
        break;
      case 'sector':
        this._jobsService.sectorListFilter.next(updatedList);
        break;
      default:
        break;
    }
  }
  
  isCheckboxChecked(prefix: string, index: number): boolean {
    const checkboxId = prefix + index;
    const checkbox = document.getElementById(checkboxId) as HTMLInputElement;
    return checkbox.checked;
  }
  

}
