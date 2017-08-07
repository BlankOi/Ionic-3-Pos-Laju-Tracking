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
  value: any;
  public posData = [];
  public latestStatus: string;
  // arr: any;

    public trackNum: any = [];
    constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public pos: PosApiProvider, public alertCtrl: AlertController, public modalCtrl: ModalController, public loadingCtrl: LoadingController) {
  }
    showConfirm() {
      let confirm = this.alertCtrl.create({
        title: 'Use this lightsaber?',
        message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
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
             
              this.storage.remove(this.value).then(() => {
                this.navCtrl.setRoot(this.navCtrl.getActive().component);
                
              });
            }
          }]
      })
      confirm.present();
    }
  
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
  ionViewDidLoad() {
    
    // this.storage.clear();
    this.storage.forEach((value) => {
      // console.log(value);
      this.trackNum.push(value);
    });   
  }

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
  trackDetail(value) {
    //send data to new HomePage
    console.log(value);
    this.showLoading();

    this.pos.getDetail(value).subscribe(result => {
      // nak amik data je
      for (var key in result.data) {
        if (result.data.hasOwnProperty(key)) {
          this.posData.push(result.data[key]);
        }
      }

      //nak amik latest status
      this.latestStatus = this.posData[0];
      console.log(this.latestStatus);
      
      //nak check code ,204 error, 200 ok, 504 "Server SPR terlalu perlahan."
      if (result.code == 200) {
        this.navCtrl.push('TrackprogressPage', { 'posData': this.posData,'trackNum':value });
        this.loader.dismiss();
        } else if  (result.code == 204) {
        this.showPrompt();
      } else if (result.code == 504) {
        this.showPrompt2();
      } else {
        console.log("Code Error", result.code);
      }

      
      
    })

   
  }

  delete(value) {
    this.value = value;
    console.log(value);
    this.showConfirm();
  }

  about() {
    let modal = this.modalCtrl.create('InfoPage');
    modal.present();
  }
}
