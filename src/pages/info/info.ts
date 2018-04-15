import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DeviceFeedback } from '@ionic-native/device-feedback';

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public haptic: DeviceFeedback,
  ) {
  }

  dismiss() {
    this.haptic.acoustic()
    this.viewCtrl.dismiss();
  }

}
