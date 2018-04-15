import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titlefix',
})
export class TitlefixPipe implements PipeTransform {

  transform(value: string, ...args) {
    return value.replace(/<[\/]{0,1}(B|b)[^><]*>/g, "");
  }
}
