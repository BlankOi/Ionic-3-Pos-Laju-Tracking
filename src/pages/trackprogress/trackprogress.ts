import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, NavOptions } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DeviceFeedback } from '@ionic-native/device-feedback';


@IonicPage()
@Component({
  selector: 'page-trackprogress',
  templateUrl: 'trackprogress.html',
})

export class TrackprogressPage {
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
    public haptic: DeviceFeedback

  ) {

  }
  ionViewDidLoad() {

    this.title = this.navParams.get('dataObj').title;
    this.trackNum = this.navParams.get('dataObj').trackingNum;
    this.dataPos = this.navParams.get('dataObj').data;
    this.lastItem = this.navParams.get('dataObj').data[0].process;
    this.lastDate = this.navParams.get('dataObj').data[0].date;
    this.lastLoc = this.navParams.get('dataObj').data[0].location;
    console.log(this.dataPos[0]);
  }


  ionViewWillLeave() {
    //empty array back to 0
    this.dataPos.length = 0;
  }


  home() {
    this.haptic.acoustic()
    const opts: NavOptions = {
      animate: true,
      animation: 'slides',
      direction: 'back',
      easing: 'ease-in-out',
    }
    this.navCtrl.setRoot('MainPage', {}, opts)

    // this.navCtrl.goToRoot({
    //    'animate': true,
    //   'animation': 'slide',
    //   'direction': 'back',
    // })
  }

  share() {
    this.haptic.acoustic()

    var options = {
      message: 'Latest Information.\n\nTracking Number: '+this.trackNum+'\nCurrent Status:'+this.lastItem + '\nLocation: ' + this.lastLoc + '\nDate: ' + this.lastDate+'\n\nGenerated using Pos Laju Tracking App, download on Google Play Store now.',
      subject: this.lastItem,
      url: 'https://play.google.com/store/apps/details?id=my.mazlan.poslajutracking',
      chooserTitle: 'Share via...'
    };
    this.social.shareWithOptions(options);
  }
}
