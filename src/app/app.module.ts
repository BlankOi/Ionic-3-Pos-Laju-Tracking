import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
// import { MainPage } from './../pages/main/main';

import { PosApiProvider } from './../providers/pos-api/pos-api';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { IonicStorageModule } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EmailComposer } from '@ionic-native/email-composer';
import { DataProvider } from '../providers/data/data';
import { AdMobFree } from '@ionic-native/admob-free';
import { AppRate } from "@ionic-native/app-rate";
import { InAppBrowser } from "@ionic-native/in-app-browser";

@NgModule({
  declarations: [
    MyApp,
    // MainPage,

  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      
      // iconMode: 'ios',
      // modalEnter: 'modal-slide-in',
      // modalLeave: 'modal-slide-out',
      // tabsPlacement: 'bottom',
      scrollAssist: false,    // Valid options appear to be [true, false]
      autoFocusAssist: false,  // Valid options appear to be ['instant', 
      pageTransition: 'ios-transition'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // MainPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    PosApiProvider,
    BarcodeScanner,
    SocialSharing,
    EmailComposer,
    DataProvider,
    AdMobFree,
    AppRate,
    InAppBrowser

  ]
})
export class AppModule {}
