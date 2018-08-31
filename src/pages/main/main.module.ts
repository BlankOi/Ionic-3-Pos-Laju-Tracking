import { NgModule } from '@angular/core';
import { IonicModule, IonicPageModule } from 'ionic-angular';
import { MainPage } from './main';
import { ComponentsModule } from '../../components/components.module';

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
export class MainPageModule {
}
