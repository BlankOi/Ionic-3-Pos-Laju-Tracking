import { ParallaxHeaderDirectiveModule } from './../../directives/parallax-header/parallax-header.module';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackprogressPage } from './trackprogress';

@NgModule({
  declarations: [
    TrackprogressPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackprogressPage),
    ParallaxHeaderDirectiveModule
    
  ],
})
export class TrackprogressPageModule {}
