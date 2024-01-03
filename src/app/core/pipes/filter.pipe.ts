import { Pipe, PipeTransform } from '@angular/core';
import { PostInterface } from '../interfaces/job-interface';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(listPosts: PostInterface[], term: string, termList: string[]): unknown {
    return null;
  }

}
