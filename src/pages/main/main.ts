import { DataProvider } from './../../providers/data/data';
import { PosApiProvider } from './../../providers/pos-api/pos-api';
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { DeviceFeedback } from '@ionic-native/device-feedback';
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  //nak check ada data ke xde, kalau xde, show div xde data
  private hasData: boolean = true;
  private loader;
  private displayItem: any[] = [];
  private storedata: { title: string, trackingNum: string, icon: string };
  private posData: any[] = [];
  //declare dataObject
  private dataObj: { title: string; trackingNum: string; data: any[]; };

  constructor(
    private navCtrl: NavController,
    private pos: PosApiProvider,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private dataProvider: DataProvider,
    public haptic: DeviceFeedback,
    public storage: Storage

  ) {
  }

  ionViewWillEnter() {
  }

  ionViewDidLoad() {
    this.dataProvider.getData().then((result) => {
      if (result.length > 0) {
        this.hasData = true;
      } else {
        this.hasData = false;
      }

      result.forEach(element => {
        this.storedata = {
          title: element.title,
          trackingNum: element.trackingNum,
          icon: element.icon
        }
        this.displayItem.push(this.storedata);
      });
    })
  }

  //pull to refresh start
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
      console.log('Async operation has ended');
      refresher.complete();
    }, 1500);
  }
  //pull to refresh end

  //show delete confirmation
  showConfirm(index, title) {
    let confirm = this.alertCtrl.create({
      title: `Are your sure want to delete ${title}?`,
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.haptic.acoustic()

            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.haptic.acoustic()

            console.log('Agree clicked');
            this.dataProvider.delete(index);
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }]
    })
    confirm.present();
  }
  //show delete confirmation end

  //code 204
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Sorry,please try again.',
      message: "Parcel is being process.",

      buttons: [
        {
          text: 'Ok',
          handler: data => {
            this.haptic.acoustic()

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
            this.haptic.acoustic()

            this.dismissLoading();
            prompt.dismiss();
          }
        }
      ]
    });
    prompt.present();
  }
  //error 504

  addTracking() {
    this.haptic.acoustic()

    this.navCtrl.push('HomePage');
  }

  //loader start
  showLoading() {
    if (!this.loader) {
      this.loader = this.loadingCtrl.create({
        content: 'Loading Data...'
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

  //value kat sini datang dari html sana, pass value untuk setiap row
  //array of semua data

  trackDetail(value) {
    this.haptic.acoustic()

    this.showLoading();
    this.pos.getDetail(value.trackingNum).subscribe(result => {
      // nak amik data je
      for (var key in result.data) {
        if (result.data.hasOwnProperty(key)) {
          this.posData.push(result.data[key]);
        }
      }
      //store semua dalm object
      this.dataObj = {
        title: value.title,
        trackingNum: value.trackingNum,
        data: this.posData,
      }
      //nak check code ,204 error, 200 ok, 504 "Server SPR terlalu perlahan."
      if (result.code == 200) {
        this.dismissLoading();
        //send data to TrackprogressPage with dataObj
        this.navCtrl.push('TrackprogressPage', { 'dataObj': this.dataObj });
      } if (result.code == 204) {
        this.showPrompt();
      } if (result.code == 504) {
        this.showPrompt2();
      }
    })
  }

  delete(index, title) {
    this.haptic.acoustic()

    // this.value = ;
    // console.log(index);
    this.showConfirm(index, title);
  }

  about() {
    this.haptic.acoustic()

    let modal = this.modalCtrl.create('InfoPage');
    modal.present();
  }
}
