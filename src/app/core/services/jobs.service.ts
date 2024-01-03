import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, tap } from 'rxjs';

import { SectorInterface } from '../interfaces/sector-interface';
import { CountryInterface } from '../interfaces/country-interface';
import { CityInterface } from '../interfaces/city-interface';
import { jobInterface } from '../interfaces/job-interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  private urlJson = 'assets/data';
  postsListChanged = new BehaviorSubject<jobInterface[]>([]);
  searchTerms = new BehaviorSubject<string | null>(null);
  countryListFilter = new BehaviorSubject<string[] | null>(null);
  cityListFilter = new BehaviorSubject<string[] | null>(null);
  sectorListFilter = new BehaviorSubject<string[] | null>(null);

  constructor(private _httpClient: HttpClient, private _toastrService: ToastrService) {}

  fetchSectorList(): Observable<SectorInterface> {
    return this._httpClient.get<SectorInterface>(`${this.urlJson}/sector.json`);
  }

  fetchCountryList(): Observable<CountryInterface> {
    return this._httpClient.get<CountryInterface>(
      `${this.urlJson}/country.json`
    );
  }

  fetchCityList(): Observable<CityInterface> {
    return this._httpClient.get<CityInterface>(`${this.urlJson}/city.json`);
  }

  get getTermValue() {
    return this.searchTerms.value;
  }
  get getCountryValue() {
    return this.countryListFilter.value;
  }
  get getCityValue() {
    return this.cityListFilter.value;
  }

  get getSectorValue() {
    return this.sectorListFilter.value;
  }

  fetchjobsList(): Observable<jobInterface[]> {
    return this._httpClient
      .get<jobInterface[]>(`${this.urlJson}/jobs.json`)
      .pipe(
        tap((jobs) => {
          const jobsFilter = jobs.filter(
            (job) =>
              (this.getTermValue
                ? job.jobTitle
                    .toLowerCase()
                    .includes(this.getTermValue.toLowerCase())
                : true) &&
              (this.getCountryValue && this.getCountryValue.length > 0
                ? this.getCountryValue.includes(job.country)
                : true) &&
              (this.getCityValue && this.getCityValue.length > 0
                ? this.getCityValue.includes(job.city)
                : true) &&
              (this.getSectorValue && this.getSectorValue.length > 0
                ? this.getSectorValue.includes(job.sector)
                : true)
          );
          this.postsListChanged.next(jobsFilter ? jobsFilter : jobs);
        })
      );
  }

  addNewJob (job: jobInterface) {
    this.postsListChanged.value.unshift(job);
    this.postsListChanged.next(this.postsListChanged.value);
    this._toastrService.success('Job added successfully')
  }
}
