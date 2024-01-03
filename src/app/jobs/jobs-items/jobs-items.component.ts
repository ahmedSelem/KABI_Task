import { DetailsJobModalComponent } from './../details-job-modal/details-job-modal.component';
import { Component } from '@angular/core';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs';

import { jobInterface } from '../../core/interfaces/job-interface';
import { JobsService } from '../../core/services/jobs.service';
import { SubDestroyService } from '../../core/services/sub-destroy.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddJobModalComponent } from '../add-job-modal/add-job-modal.component';

@Component({
  selector: 'app-jobs-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jobs-items.component.html',
  styleUrl: './jobs-items.component.scss',
})
export class JobsItemsComponent {
  private searchTerms = new Subject<string>();
  searchText!: string;
  private readonly itemsPerPage = 10;
  currentNumPage: number = 0;
  postsList: jobInterface[] = [];
  allPostsList: jobInterface[] = [];
  paginationNum: number[] = [];

  constructor(
    private _jobsService: JobsService,
    private _destroy$: SubDestroyService,
    private _bsModalService: BsModalService,
  ) {}

  ngOnInit(): void {
    this.fetchPostsList();
    this.fetchPostsListChanged();
    this.searchTerm();
  }
  fetchPostsList() {
    this._jobsService
      .fetchjobsList()
      .pipe(takeUntil(this._destroy$))
      .subscribe((jobs) => {
        console.log(jobs);
      });
  }

  fetchPostsListChanged(pageSelected: number = 0) {
    this._jobsService.postsListChanged.subscribe((jobs) => {
      this.handlePagination(jobs, pageSelected);
    });
  }

  private handlePagination(response: jobInterface[], pageSelected: number) {
    const numberOfPages = Math.ceil(response.length / this.itemsPerPage);
    this.paginationNum = new Array(numberOfPages)
      .fill('')
      .map((_, num) => num + 1);
    this.postsList = response.slice(
      pageSelected * this.itemsPerPage,
      (pageSelected + 1) * this.itemsPerPage
    );
    this.currentNumPage = pageSelected;
    this.allPostsList = response;
  }

  searchTerm() {
    this.searchTerms
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((_) => this._jobsService.fetchjobsList())
      )
      .subscribe((results) => {
        console.log(results);
      });
  }

  onSearchInputChange(): void {
    this.searchTerms.next(this.searchText);
    this._jobsService.searchTerms.next(this.searchText);
  }

  onNextPage() {
    if (this.currentNumPage < this.paginationNum.length - 1) {
      this.fetchPostsListChanged(++this.currentNumPage);
    }
  }

  onPrevPage() {
    if (this.currentNumPage >= 1) {
      this.fetchPostsListChanged(--this.currentNumPage);
    }
  }

  deleteJob(index: number) {
    Swal.fire({
      title: 'Are you sure to delete job?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        this.allPostsList.splice(index, 1);
        this._jobsService.postsListChanged.next(this.allPostsList);
      }
    });
  }

  openAddModal() {
    this._bsModalService.show(AddJobModalComponent, {
      class: 'modal-md',
    });
  }

  openDetailsModal(jobObj: jobInterface) {
    const initialState = { jobObj: jobObj};

    this._bsModalService.show(DetailsJobModalComponent, {
      class: 'modal-md',
      initialState
    });
  }
}
