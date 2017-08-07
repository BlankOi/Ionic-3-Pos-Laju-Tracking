import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-trackprogress',
  templateUrl: 'trackprogress.html',
})
export class TrackprogressPage {
  public trackNum: string;
  public dataPos: string[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewDidLoad() {
  
    this.dataPos = this.navParams.get('posData');
    this.trackNum = this.navParams.get('trackNum');
    console.log(this.dataPos);
}
  
  home() {

    this.navCtrl.goToRoot({
      'animate': true,
      'animation': 'slide',
      'direction': 'back'});
 }
}
