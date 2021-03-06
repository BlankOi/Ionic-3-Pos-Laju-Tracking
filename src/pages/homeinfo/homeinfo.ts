import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DeviceFeedback } from '@ionic-native/device-feedback';


@IonicPage()
@Component({
  selector: 'page-homeinfo',
  templateUrl: 'homeinfo.html',
})
export class HomeinfoPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public haptic: DeviceFeedback,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeinfoPage');
  }

  dismiss() {
    this.haptic.acoustic();
    this.viewCtrl.dismiss();
  }
}
