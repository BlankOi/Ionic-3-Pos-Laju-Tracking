import { Component } from '@angular/core';
//BarcodeScanner
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DeviceFeedback } from '@ionic-native/device-feedback';
//IonicStorageModule
import { Storage } from '@ionic/storage';
import {
  ActionSheetController,
  AlertController,
  Events,
  IonicPage,
  LoadingController,
  NavController,
  ToastController
} from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
//pos provider
import { PosApiProvider } from '../../providers/pos-api/pos-api';
import 'rxjs/add/operator/timeout';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  trackingNumDB: any[] = [];

  dataObj: {
    title: string;
    trackingNum: string;
    data: any[];
    code: number;
    icon: string;
  };

  //declare dataObject
  dataObjNew = [];

  //data dari barcode
  public barCodeData = {};
  //list of tracking status
  public trackingStatus: any[] = [];

  //variable untuk store data dari form
  public trackingNum: string;
  public title: string;
  public code: number;
  public icon: string = 'basket';
  //loader start
  public loader;

  constructor(
    public navCtrl: NavController,
    private pos: PosApiProvider,
    public barcode: BarcodeScanner,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public dataProvider: DataProvider,
    public haptic: DeviceFeedback,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public events: Events
  ) {
  }

  ionViewDidLoad() {
    this.dataProvider.getData.subscribe((result) => {
      if (result != undefined && result != null) {
        this.trackingNumDB = result;
        console.log("data from db:", this.trackingNumDB)
      } else {
        this.trackingNumDB = [];
      }
    })
  }

  //BarcodeScanner
  scan() {
    this.haptic.acoustic();
    this.barcode.scan().then((barcodeData) => {
      this.trackingNum = barcodeData.text;
    }, (err) => {
      // An error occurred
    });
  }

  //track button
  getTracking() {
    this.haptic.acoustic();
    this.showLoading();
    if (this.trackingNumDB != null && this.trackingNumDB != undefined) {
      if (this.trackingNumDB.map(element => {
        return element.trackingNum
      }).indexOf(this.trackingNum.toUpperCase().replace(/\s/g, "")) == -1) {
        this.pos.getDetail(this.trackingNum.toUpperCase().replace(/\s/g, ""))
          .timeout(10000)
          .subscribe(result => {
              this.code = result.code;

              // nak amik key data je (list tracking status) dan save dlm trackingStatus array
              for (let key in result.data) {
                if (result.data.hasOwnProperty(key)) {
                  this.trackingStatus.push(result.data[key]);
                }
              }

              //store semua dalm object
              this.dataObj = {
                title: this.title,
                trackingNum: this.trackingNum.toUpperCase().replace(/\s/g, ""),
                data: this.trackingStatus,
                code: result.code,
                icon: this.icon
              };
              console.log('dataObj:', this.dataObj);

              //nak check code ,204 error, 200 ok, 504 "Server terlalu perlahan."
              if (result.code == 200) {
                this.dismissLoading();
                //save dataObj guna key trackingNum, so retrive guna get()
                // this.dataObjNew.push(this.dataObj);
                this.dataProvider.save(this.dataObj);

                //send data to TrackprogressPage
                this.navCtrl.push('TrackprogressPage', {'dataObj': this.dataObj});

              }
              if (result.code == 204) {
                this.showPrompt();
              }
              if (result.code == 504) {
                this.showPrompt2();
              }
            },
            error => {
              this.dismissLoading();
              this.connectionTimeout();
            })
      } else {
        console.log('data exist');
        this.dataExist();
      }
    }
  }

  //this function will save the tracking number directly
  saveDraft() {
    this.haptic.acoustic();

    if (this.trackingNumDB.map(element => {
      return element.trackingNum
    }).indexOf(this.trackingNum.toUpperCase().replace(/\s/g, "")) == -1) {
      this.dataObj = {
        title: this.title,
        trackingNum: this.trackingNum.toUpperCase().replace(/\s/g, ""),
        data: this.trackingStatus,
        code: 0,
        icon: this.icon
      };

      this.dataProvider.save(this.dataObj);

      let prompt = this.alertCtrl.create({
        title: 'Tracking Number Saved',
        message: `${this.title != undefined ? this.title : this.trackingNum} - ${this.trackingNum}`,
        buttons: [
          {
            text: 'Ok',
            handler: data => {
              this.trackingNum = '';
              this.title = '';
              this.events.publish('data:created', this.trackingNum.toUpperCase());
              prompt.dismiss();
            }
          }
        ]
      });
      prompt.present();

    } else {
      console.log('data exist');
      this.dataExist();
    }

  }

  showLoading() {
    this.loader = this.loadingCtrl.create({
      content: 'Checking...'
    });
    this.loader.present();
  }

  //loader dismiss
  dismissLoading() {
    if (this.loader) {
      this.loader.dismiss();
      this.loader = null;
    }
  }

  //code 204
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Sorry, no record found.',
      message: "Your item might not be process yet, please try again later.",
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            this.dismissLoading();
          }
        }
      ]
    });
    prompt.present();
  }

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

  //data exist
  dataExist() {
    let prompt = this.alertCtrl.create({
      title: 'Data Exist',
      message: "Tracking Number already exist, please check your tracking number again.",
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

  //code connectionTimeout
  connectionTimeout() {
    let prompt = this.alertCtrl.create({
      title: 'Connection Timeout.',
      message: "Please check your internet connection.",

      buttons: [
        {
          text: 'Ok',
          handler: data => {
            this.haptic.acoustic();

            this.dismissLoading();
            prompt.dismiss();
          }
        }
      ]
    });
    prompt.present();
  }

  reset() {
    this.haptic.acoustic();

    this.trackingStatus = [];
    this.trackingNum = '';
  }

  iconSelect() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Choose category",
      buttons: [
        {
          text: "Basket",
          icon: "basket",
          handler: () => {
            this.icon = 'basket';
            this.toast('Basket');
          }
        },
        {
          text: "Tool",
          icon: "build",
          handler: () => {
            this.icon = 'build';
            this.toast('Tool');
          }
        },
        {
          text: "Beverages ",
          icon: "cafe",
          handler: () => {
            this.icon = 'cafe';
            this.toast('Beverages');
          }
        },
        {
          text: "Gift ",
          icon: "cube",
          handler: () => {
            this.icon = 'cube';
            this.toast('Gift');
          }
        },
        {
          text: "Electronics",
          icon: "desktop",
          handler: () => {
            this.icon = 'desktop';
            this.toast('Electronics');
          }
        },
        {
          text: "Letter",
          icon: "mail-open",
          handler: () => {
            this.icon = 'mail-open';
            this.toast('Letter');
          }
        },
        {
          text: "Cloth",
          icon: "shirt",
          handler: () => {
            this.icon = 'shirt';
            this.toast('Cloth');
          }
        }
      ]
    });
    actionSheet.present();
  }

  toast(cat) {
    let toast = this.toastCtrl.create({
      message: `${cat} selected`,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
