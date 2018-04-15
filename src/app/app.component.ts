import { Component } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { AppRate } from '@ionic-native/app-rate';
import { DeviceFeedback } from '@ionic-native/device-feedback';
import { EmailComposer } from '@ionic-native/email-composer';
import { HeaderColor } from '@ionic-native/header-color';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from "@ionic/storage";
import { App, Events, Platform } from 'ionic-angular';
import { KEYS } from "../private/constant";
import { DataProvider } from '../providers/data/data';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public events: Events,
    public app: App,
    public appRate: AppRate,
    public iab: InAppBrowser,
    private emailComposer: EmailComposer,
    public social: SocialSharing,
    public adMobFree: AdMobFree,
    public dataProvider: DataProvider,
    public haptic: DeviceFeedback,
    public storage: Storage,
    public header: HeaderColor,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      // set status bar to white
      statusBar.backgroundColorByHexString('#f6515f');
      header.tint("#f6515f");
      splashScreen.hide();

      //check whether user had open the app, if not, set walkthrough
      this.storage.get("intro-done").then(done => {
        if (!done) {
          this.storage.set("intro-done", true);
          this.rootPage = "WalkthroughPage";
        } else {
          this.rootPage = "MainPage";
        }
      });

      this.showBannerAd();
    });
  }

  ionViewDidLoad() { }

  //ads
  async showBannerAd() {
    try {
      const bannerConfig: AdMobFreeBannerConfig = {
        id: KEYS.ADMOB,
        isTesting: false,
        autoShow: true
      }
      this.adMobFree.banner.config(bannerConfig);
      const result = await this.adMobFree.banner.prepare();
      console.log(result);
    }
    catch (e) {
      console.error(e);
    }
  }
  //ads end

  onMenuOpen(event) {
    this.events.publish('sidebar:open');
  }

  onMenuClose(event) {
    this.events.publish('sidebar:close');
  }

  presentModal() {
    this.haptic.acoustic()
    this.app.getActiveNav().push('InfoPage');
  }

  rate() {
    //rate App
    this.haptic.acoustic()
    this.appRate.preferences.storeAppURL = {
      android: 'market://details?id=my.mazlan.poslajutracking'
    }
    this.appRate.promptForRating(true);
    //rate end
  }

  moreapp() {
    this.haptic.acoustic()
    this.iab.create('https://play.google.com/store/apps/dev?id=7340219747104934293&hl=en', '_system')
  }

  portfolio() {
    this.haptic.acoustic()
    this.iab.create('https://play.google.com/store/apps/details?id=my.mazlan.myresume', '_system')
  }

  sendEmail() {
    this.haptic.acoustic()
    this.emailComposer.addAlias('gmail', 'com.google.android.gm');
    this.emailComposer.open({
      app: 'gmail',
      to: 'care@pos.com.my',
      cc: 'lan.psis@gmail.com',
      subject: 'Pos Laju Tracking App',
      body: 'Send your feedback to care@pos.com.my: ',
      isHtml: true
    });
  }

  sendEmailToMe() {
    this.haptic.acoustic()
    this.emailComposer.addAlias('gmail', 'com.google.android.gm');
    this.emailComposer.open({
      app: 'gmail',
      to: 'lan.psis@gmail.com',
      subject: 'Pos Laju Tracking App',
      body: 'Pos Laju Tracking is a free app to help users to track Pos Laju Parcel. Download now at Google Play Store: https://play.google.com/store/apps/details?id=my.mazlan.poslajutracking',
      isHtml: true
    });
  }

  share() {
    this.haptic.acoustic()
    var options = {
      message: 'Pos Laju Tracking is a free app to help users to track Pos Laju Parcel. Download now at Google Play Store',
      subject: 'Pos Laju Tracking App',
      url: 'https://play.google.com/store/apps/details?id=my.mazlan.poslajutracking',
      chooserTitle: 'Share via...'
    };
    this.social.shareWithOptions(options);
  }
}

