import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EmailComposer } from '@ionic-native/email-composer';



@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public social: SocialSharing, private emailComposer: EmailComposer) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  share() {
    var options = {
      message: 'Pos Laju Tracking is a free app to help users to track Pos Laju Parcel. Download now at Google Play Store:',
      subject: 'Pos Laju Tracking',
      url: 'https://play.google.com/store/apps/details?id=my.mazlan.poslajutracking',
      chooserTitle: 'Share via...'
    };



    this.social.shareWithOptions(options);
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
}
