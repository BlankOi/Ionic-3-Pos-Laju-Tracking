import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MainPage } from './main';
import { ComponentsModule } from '../../components/components.module';
import { IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    MainPage,
  ],
  imports: [
    IonicPageModule.forChild(MainPage),
    IonicModule,
    ComponentsModule
  ],
})
export class MainPageModule {}
