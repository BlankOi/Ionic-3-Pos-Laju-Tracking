import { DataProvider } from './../../providers/data/data';
import { TrackprogressPage } from './../trackprogress/trackprogress';
import { PosApiProvider } from './../../providers/pos-api/pos-api';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, LoadingController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  //nak check ada data ke xde, kalau xde, show div xde data
  public hasData: boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public pos: PosApiProvider, public alertCtrl: AlertController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public dataProvider: DataProvider) {
  
    }
  
  //pull to refresh start
    doRefresh(refresher) {
      console.log('Begin async operation', refresher);
      this.navCtrl.setRoot(this.navCtrl.getActive().component);

      setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
      }, 2000);
    }
  //pull to refresh end

  //show delete confirmation
    showConfirm(index) {
      let confirm = this.alertCtrl.create({
        title: 'Are your sure want to delete?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              console.log('Agree clicked');
              this.dataProvider.delete(index);

              // this.storage.remove(trackingNum).then(() => {
                this.navCtrl.setRoot(this.navCtrl.getActive().component);
                
              // });
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

  addTracking() {
    this.navCtrl.push('HomePage');
  }

  //loader start 
  public loader;
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
  displayItem=[];

  storedata: { title: string, trackingNum: string, latestStatus: string };
  ionViewDidLoad() {
    this.dataProvider.getData().then((result) => {
      // console.log(result);
      //change page to hasData true
      if (result.length>0) {
        // console.log(this.storedata);
        this.hasData = true;
      }


      for (var key in result) {
        if (result.hasOwnProperty(key)) {
          //store dalam storedata object
          this.storedata = {
              title:result[key].title,
              trackingNum: result[key].trackingNum,
              latestStatus: result[key].data[0].process
          }
          this.displayItem.push(this.storedata);
          // console.log(this.displayItem);
        }
      }

    })

 
  }

  //value kat sini datang dari html sana, pass value untuk setiap row
  //array of semua data
  public posData = [];
  //declare dataObject
  public dataObj: { title: string; trackingNum: string; data: any[]; };
  trackDetail(value) {
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

  delete(index) {
    // this.value = ;
    // console.log(index);
    this.showConfirm(index);
  }

  about() {
    let modal = this.modalCtrl.create('InfoPage');
    modal.present();
  }
}
