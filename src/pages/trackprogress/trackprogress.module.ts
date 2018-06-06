import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';
import { ParallaxHeaderDirectiveModule } from './../../directives/parallax-header/parallax-header.module';
import { TrackprogressPage } from './trackprogress';
import { ComponentsModule } from '../../components/components.module';
import { IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    TrackprogressPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackprogressPage),
    ParallaxHeaderDirectiveModule,
    PipesModule,
    IonicModule,
    ComponentsModule
  ],
})
export class TrackprogressPageModule {}
