import { Component, Input } from '@angular/core';

@Component({
  selector: 'chip2',
  templateUrl: 'chip2.html'
  
})
export class Chip2Component {

  @Input('text') text: string;
  @Input('icon') icon: string;
  
  constructor() {}
  

}
