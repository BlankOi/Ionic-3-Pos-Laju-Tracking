import { DataProvider } from './../../providers/data/data';
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
  dataObj: { title: string; trackingNum: string; data: any[]; code: number; };
  //declare dataObject
  dataObjNew= [];

  //data dari barcode
  public barCodeData = {};
  //list of tracking status
  public trackingStatus: any[] = [];
  
  //variable untuk store data dari form
  public trackingNum: string;
  public title: string;
  public code: number;


  constructor(
    public navCtrl: NavController,
    private pos: PosApiProvider,
    public barcode: BarcodeScanner,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public dataProvider:DataProvider
  ) {
  }


  //loader start 
  public loader;
  showLoading() {
    if (!this.loader) {
      this.loader = this.loadingCtrl.create({
        content: 'Checking...'
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

  //code 204
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Sorry, no record found.',
      message: "Please make sure your tracking number is correct or try again later.",

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
      title: 'Sorry, Server usage is too high.',
      message: "Please try again later.",

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

  //BarcodeScanner
  scan() {
    this.barcode.scan().then((barcodeData) => {
      this.trackingNum = barcodeData.text;
    }, (err) => {
      // An error occurred
    });
  }
  //BarcodeScanner end

  //track button
  getTracking() {
    this.showLoading();

    this.pos.getDetail(this.trackingNum).subscribe(result => {
      // this.code = result.code;

      // nak amik key data je (list tracking status) dan save dlm trackingStatus array
      for (var key in result.data) {
        if (result.data.hasOwnProperty(key)) {
          this.trackingStatus.push(result.data[key]);
        }
      }
      
      //store semua dalm object
      this.dataObj = {
        title: this.title,
        trackingNum: this.trackingNum,
        data: this.trackingStatus,
        code: result.code
      }

      //nak check code ,204 error, 200 ok, 504 "Server SPR terlalu perlahan."
      if (result.code == 200) {
        this.dismissLoading();
        //save dataObj guna key trackingNum, so retrive guna get() 
        // this.dataObjNew.push(this.dataObj);
        this.dataProvider.save(this.dataObj);
        // this.storage.set(this.dataObj.trackingNum, this.dataObj);

          //send data to new HomePage
          this.navCtrl.push('TrackprogressPage', {'dataObj':this.dataObj});
        
       
      } if (result.code == 204) {
        this.showPrompt();
      } if (result.code == 504) {
        this.showPrompt2();
      }
    })
  }

  reset() {
    this.trackingStatus = [];
    this.trackingNum = '';
  }
}
