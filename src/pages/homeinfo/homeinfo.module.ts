import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeinfoPage } from './homeinfo';

@NgModule({
  declarations: [
    HomeinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeinfoPage),
  ],
})
export class HomeinfoPageModule {}
