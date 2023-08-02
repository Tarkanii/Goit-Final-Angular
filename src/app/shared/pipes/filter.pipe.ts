import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: string, callback: (value: string) => boolean ): boolean {
    // Callback is the filtering function
    return callback(value);
  }

}
