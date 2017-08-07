import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';

//pos provider
import { PosApiProvider } from './../../providers/pos-api/pos-api';

//BarcodeScanner
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

//IonicStorageModule
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  posDataObj: any;
  public barCodeData = {};
  public posData: any[] = [];
  trackingNum: string;

  constructor(public navCtrl: NavController, private pos: PosApiProvider, public barcode: BarcodeScanner, public storage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {

  }

  //loader start 
  public loader;

  showLoading() {
    if (!this.loader) {
      this.loader = this.loadingCtrl.create({
        content: 'Menyemak Data...'
      });
      this.loader.present();
    }
  }
  dismissLoading() {
    if (this.loader) {
      this.loader.dismiss();
      this.loader = null;
    }
  }
  // loader end

  //BarcodeScanner
  scan() {
    this.barcode.scan().then((barcodeData) => {
      this.trackingNum = barcodeData.text;
    }, (err) => {
      // An error occurred
    });
  }
  //BarcodeScanner end

  //code 204
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Maaf, Tiada rekod ditemui.',
      message: "Anda mungkin belum mendaftar atau nombor kad pengenalan yang dimasukkan tidak tepat.",

      buttons: [
        {
          text: 'Ok',
          handler: data => {
            this.dismissLoading();
            // prompt.dismiss();
          }
        }
      ]
    });
    prompt.present();
  }
  //error 202 end

  //code 504
  showPrompt2() {
    let prompt = this.alertCtrl.create({
      title: 'Maaf, Server SPR terlalu perlahan.',
      message: "Server SPR mengalami gangguan, sila cuba sebentar lagi.",

      buttons: [
        {
          text: 'Ok',
          handler: data => {
            this.dismissLoading();
            prompt.dismiss();
          }
        }
      ]
    });
    prompt.present();
  }
  //error 504

  getTracking() {
    this.showLoading();

    this.pos.getDetail(this.trackingNum).subscribe(result => {
      // this.posDataObj = result;
      // console.log('this.posData = result;: ', this.posData );

     

      // nak amik data je
      for (var key in result.data) {
        if (result.data.hasOwnProperty(key)) {
          this.posData.push(result.data[key]);
        }
      }
  
      //nak check code ,204 error, 200 ok, 504 "Server SPR terlalu perlahan."
      if (result.code == 200) {
        this.dismissLoading();
        //save trackingNum
        this.storage.set(this.trackingNum, this.trackingNum).then(() => {
          //send data to new HomePage
          this.navCtrl.push('TrackprogressPage', { 'posData': this.posData, 'trackNum':this.trackingNum });
        });
       
      } if (result.code == 204) {
        this.showPrompt();
      } if (result.code == 504) {
        this.showPrompt2();
      } else {
        console.log("Code Error", result.code);
      }

    })
    

  }

  reset() {
    this.posData = [];
    this.trackingNum = '';
  }





}
//try masuk sini dib, tengok list api
//https://api.jomgeek.com/v1/