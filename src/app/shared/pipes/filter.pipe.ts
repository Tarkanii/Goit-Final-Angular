import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: string, callback: (value: string) => boolean ): boolean {
    return callback(value);
  }

}
