import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppRate } from '@ionic-native/app-rate';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EmailComposer } from '@ionic-native/email-composer';
import { Component } from '@angular/core';
import { Platform, Events, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'MainPage';

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public events: Events,
    public app: App,
    public appRate: AppRate,
    public iab: InAppBrowser,
    private emailComposer: EmailComposer,
    public social: SocialSharing
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onMenuOpen(event) {
    this.events.publish('sidebar:open');
  }

  onMenuClose(event) {
    this.events.publish('sidebar:close');
  }

  presentModal() {
    this.app.getActiveNav().push('InfoPage');
  }

  ionViewDidLoad() {

  }
  rate() {
    //rate App
    this.appRate.preferences.storeAppURL = {
      android: 'market://details?id=my.mazlan.poslajutracking'
    }
    this.appRate.promptForRating(true);
    //rate end
  }

  moreapp() {
    this.iab.create('https://play.google.com/store/apps/dev?id=7340219747104934293&hl=en', '_system')

  }

  portfolio() {
    this.iab.create('https://play.google.com/store/apps/details?id=my.mazlan.myresume', '_system')

  }
  sendEmail() {


    this.emailComposer.addAlias('gmail', 'com.google.android.gm');

    this.emailComposer.open({
      app: 'gmail',
      to: 'lan.psis@gmail.com',

      subject: 'Hi from Pos Laju Tracking App',
      body: 'Pos Laju Tracking is a free app to help users to track Pos Laju Parcel. Download now at Google Play Store: https://play.google.com/store/apps/details?id=my.mazlan.poslajutracking',
      isHtml: true
    });


  }

  share() {
    var options = {
      message: 'Pos Laju Tracking is a free app to help users to track Pos Laju Parcel. Download now at Google Play Store',
      subject: 'Pos Laju Tracking App',
      url: 'https://play.google.com/store/apps/details?id=my.mazlan.poslajutracking',
      chooserTitle: 'Share via...'
    };



    this.social.shareWithOptions(options);
  }

}

