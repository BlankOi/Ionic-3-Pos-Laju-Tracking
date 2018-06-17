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
import { App, Events, Platform, AlertController } from 'ionic-angular';
import { KEYS } from "../private/constant";
import { DataProvider } from '../providers/data/data';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  displayItem: any[];
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
    public alertCtrl: AlertController,
    private push: Push
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // set status bar to white
      statusBar.backgroundColorByHexString('#F6515F');
      header.tint("#F6515F");
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
      this.pushSetup();
    });
  }

  ionViewDidLoad() {

  }

  //push noti
  pushSetup() {
    // to initialize push notifications

    const options: PushOptions = {
      android: {
        senderID: '447792138736',
        sound: true,
        vibrate: true,
        forceShow: true,
        icon: 'noti',
        iconColor: 'red'
      }
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {
      if (notification.additionalData.foreground) {
        let youralert = this.alertCtrl.create({
          title: 'New Push notification',
          message: notification.message
        });
        youralert.present();
      }
    });

    pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  //ads
  async showBannerAd() {
    try {
      const bannerConfig: AdMobFreeBannerConfig = {
        id: KEYS.ADMOB,
        isTesting: false,
        autoShow: true
      }
      this.adMobFree.banner.config(bannerConfig);
      await this.adMobFree.banner.prepare();
    }
    catch (e) {
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
    let alert = this.alertCtrl.create();
    alert.setTitle('Please select your item?');

    this.dataProvider.getData.subscribe((element) => {
      console.log('element', element)
      if (element.length != 0) {
        element.forEach(item => {
          alert.addInput({
            type: 'checkbox',
            label: item.title,
            value: item.trackingNum
          });
        });
        alert.addButton('Cancel');
        alert.addButton({
          text: 'Okay',
          handler: (data: any) => {
            console.log('Checkbox data:', data);
            this.emailPos(data);
          }
        });
        alert.present();
      } else {
        //no data, ask them to add first
        this.showPrompt()
      }
    })

  }

  emailPos(trackingNums) {
    let test = `
      ${trackingNums.map((item, i) => `
      <ul>
        <li>&#8226; <b>${item}</b></li>
        </ul>
      `).join('')}
    `
    this.emailComposer.addAlias('gmail', 'com.google.android.gm');
    this.emailComposer.open({
      app: 'gmail',
      to: 'care@pos.com.my',
      cc: 'lan.psis@gmail.com',
      subject: 'Pos Laju Tracking App',
      body: `1) Tracking number: 
             ${test}
              <br>
              2) Receiver’s Name:<br>
              3) Recipient’s Full Address: <br>
              4) Receiver’s Contact Number:<br>
              5) Item content (Optional):<br>
            `,
      isHtml: true
    });
  }

  sendEmailToMe() {
    this.haptic.acoustic()
    this.emailComposer.addAlias('gmail', 'com.google.android.gm');
    this.emailComposer.open({
      app: 'gmail',
      to: 'lan.psis@gmail.com',
      subject: 'Pos Laju Tracking App Feedback',
      body: `Give your feedback about this app. If you find any bugs or error or if u want to request some amazing feautures, please let me know ok. 
      <br>*I'm not working under Pos Laju, I just made this app to make your life easier :)  
      <br><br>
      Feedback: 
      `,
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

  //No data
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'No tracking number.',
      message: "Please add at least one tracking number first to help POS Laju track your parcel easily.",
      buttons: [
        {
          text: 'Ok',
          handler: data => {
          }
        }
      ]
    });
    prompt.present();
  }
}

