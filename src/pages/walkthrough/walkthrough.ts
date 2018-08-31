import { Component } from '@angular/core';
import { Storage } from "@ionic/storage";
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html',
})
export class WalkthroughPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage
  ) {
  }

  navHome() {
    this.navCtrl.setRoot('MainPage');
    this.storage.set("intro-done", true);
  }

}
