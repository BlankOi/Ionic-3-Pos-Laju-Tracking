import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AdMobFree } from '@ionic-native/admob-free';
import { AppRate } from "@ionic-native/app-rate";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Clipboard } from '@ionic-native/clipboard';
import { DeviceFeedback } from "@ionic-native/device-feedback";
import { EmailComposer } from '@ionic-native/email-composer';
import { HeaderColor } from "@ionic-native/header-color";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Screenshot } from "@ionic-native/screenshot";
import { SocialSharing } from '@ionic-native/social-sharing';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { DataProvider } from '../providers/data/data';
import { PosApiProvider } from '../providers/pos-api/pos-api';
import { MyApp } from './app.component';
import { Push } from '@ionic-native/push';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,    // Valid options appear to be [true, false]
      autoFocusAssist: false,  // Valid options appear to be ['instant',
      pageTransition: 'ios-transition',
      mode: 'ios'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PosApiProvider,
    BarcodeScanner,
    SocialSharing,
    EmailComposer,
    DataProvider,
    AdMobFree,
    AppRate,
    InAppBrowser,
    DeviceFeedback,
    Clipboard,
    Screenshot,
    HeaderColor,
    Push
  ]
})
export class AppModule {
}
