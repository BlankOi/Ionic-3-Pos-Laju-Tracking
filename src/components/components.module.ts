import { NgModule } from '@angular/core';
import { Chip2Component } from './chip2/chip2';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [Chip2Component],
  imports: [IonicModule, CommonModule],
  exports: [Chip2Component]
})
export class ComponentsModule {
}
