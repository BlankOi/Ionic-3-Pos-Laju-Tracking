import { Component } from '@angular/core';
import { DeviceFeedback } from '@ionic-native/device-feedback';
import { Screenshot } from "@ionic-native/screenshot";
import { SocialSharing } from '@ionic-native/social-sharing';
import { Storage } from '@ionic/storage';
import { IonicPage, LoadingController, NavController, NavOptions, NavParams, Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-trackprogress',
  templateUrl: 'trackprogress.html',
})

export class TrackprogressPage {
  loader: any;
  lastLoc: any;
  lastDate: any;
  public title: string;
  public trackNum: string;
  public lastItem: any;

  public dataPos: string[];
  //try save semua data dalam object
  public dataObj: { title: string; trackingNum: string; data: any[]; };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public storage: Storage,
    public social: SocialSharing,
    public haptic: DeviceFeedback,
    public screenshot: Screenshot,
    public loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    if (this.navParams.get('dataObj') != undefined) {
      this.title = this.navParams.get('dataObj').title;
      this.trackNum = this.navParams.get('dataObj').trackingNum;
      this.dataPos = this.navParams.get('dataObj').data;
      this.lastItem = this.navParams.get('dataObj').data[0].process.replace(/<[\/]{0,1}(B|b)[^><]*>/g, "");
      this.lastDate = this.navParams.get('dataObj').data[0].date;
      this.lastLoc = this.navParams.get('dataObj').data[0].location;
      console.log(this.dataPos[0]);
    }

  }

  ionViewWillLeave() {
    //empty array back to 0
    this.dataPos = [];
  }

  home() {
    this.haptic.acoustic();
    const opts: NavOptions = {
      animate: true,
      animation: 'slides',
      direction: 'back',
      easing: 'ease-in-out',
      // duration: 200
    };
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
    });
    this.loader.present();
    this.navCtrl.setRoot('MainPage', {}, opts).then(() => {
      this.loader.dismiss();
    });
  }

  share() {
    this.haptic.acoustic();
    let options = {
      message: 'Latest Information.\n\nTracking Number: ' + this.trackNum + '\nCurrent Status:' + this.lastItem + '\nLocation: ' + this.lastLoc + '\nDate: ' + this.lastDate + '\n\nGenerated using Pos Laju Tracking App, download on Google Play Store now.',
      subject: this.lastItem,
      url: 'https://play.google.com/store/apps/details?id=my.mazlan.poslajutracking',
      chooserTitle: 'Share via...'
    };
    this.social.shareWithOptions(options);
  }

  takeScreenshot() {
    this.haptic.acoustic();
    this.screenshot.URI(80).then((res) => {
      this.social.share('Latest Information.\n\nTracking Number: ' + this.trackNum + '\nCurrent Status:' + this.lastItem + '\nLocation: ' + this.lastLoc + '\nDate: ' + this.lastDate + '\n\nGenerated using Pos Laju Tracking, download on Google Play Store now..\n\n', 'Latest Information', res.URI, 'https://play.google.com/store/apps/details?id=my.mazlan.poslajutracking');
    });
  }

}
