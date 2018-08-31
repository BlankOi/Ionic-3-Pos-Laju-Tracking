import {Component} from '@angular/core';
import {Clipboard} from '@ionic-native/clipboard';
import {DeviceFeedback} from '@ionic-native/device-feedback';
import {Storage} from "@ionic/storage";
import {
  AlertController,
  Events,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  ToastController
} from 'ionic-angular';
import {DataProvider} from '../../providers/data/data';
import {PosApiProvider} from '../../providers/pos-api/pos-api';
import 'rxjs/add/operator/timeout';

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  flag: any = false;
  iconList: string = 'list';
  myInput: string;
  public storedata: { title: string, trackingNum: string, icon: string };
  //nak check ada data ke xde, kalau xde, show div xde data
  private hasData: boolean = false;
  private loader;
  private displayItem: any[] = [];
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
    public storage: Storage,
    public clipboard: Clipboard,
    public toast: ToastController,
    public events: Events,
  ) {
    events.subscribe('data:created', (trackNo) => {
      console.log('event triggered!');

      this.dataProvider.getData.subscribe((result) => {
        if (result != undefined && result != null) {
          if (result.length != 0) {
            this.hasData = true;
            result.forEach(element => {
              this.storedata = {
                title: element.title,
                trackingNum: element.trackingNum,
                icon: element.icon
              }
            });

            if (this.displayItem.map(element => {
              return element.trackingNum
            }).indexOf(trackNo) == -1) {
              this.displayItem.push(this.storedata);
            }
          } else {
            this.hasData = false;
          }
        }
      });
    });
  }

  ionViewDidLoad() {
    this.dataProvider.getData.subscribe((result) => {
      console.log('ionViewDidLoad main: result-', result);
      if (result != undefined && result != null) {
        if (result.length != 0) {
          this.hasData = true;
          result.forEach(element => {
            this.storedata = {
              title: element.title,
              trackingNum: element.trackingNum,
              icon: element.icon
            };
            this.displayItem.push(this.storedata);
          });
        } else {
          this.hasData = false;
        }
      }
    })
  }

  //pull to refresh start
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      this.storage.get('tracking').then(x => {
        console.log('new', x)
      });
      console.log('Async operation has ended');
      refresher.complete();
    }, 1500);
  }

  actionBtn() {
    this.haptic.acoustic();

    this.flag = !this.flag;
    if (this.flag) {
      this.iconList = 'checkmark-circle';
    } else {
      this.iconList = 'list';
      this.storage.set('tracking', this.displayItem).then((x) => {
        console.log(' main: result-', x);
        this.displayItem = x;
      })
    }
  }

  filterItems(ev: any) {
    let val = ev.target.value;
    console.log('val', this.myInput);

    // if (this.displayItem != undefined && this.displayItem.length != 0) {
    if (!this.myInput) {
      console.log('no val', this.myInput);
      this.dataProvider.getData.subscribe((result) => {
        if (result != undefined && result != null) {
          this.displayItem = result;

          console.log('this.displayItem', this.displayItem);
          return this.displayItem;
          // result.forEach(element => {
          //   this.storedata = {
          //     title: element.title,
          //     trackingNum: element.trackingNum,
          //     icon: element.icon
          //   }
          //   this.displayItem = [];
          //   // if (this.displayItem.map(item => { return item.trackingNum }).indexOf(element.trackingNum) == -1) {
          //     return this.displayItem.push(this.storedata);
          //   // }
          // });
        }
      })
      // this.storage.get('tracking').then(x => {
      //   console.log('new', x)
      //   this.displayItem = x;
      // })
    } else {
      console.log('val', this.myInput);
      this.displayItem = this.displayItem.filter(item => {
        return item.title.toLowerCase().includes(val.toLowerCase()) || item.trackingNum.toLowerCase().includes(val.toLowerCase())
      });
    }
    // }
  }

  reorderItems(indexes) {

    console.log('before', this.displayItem);
    let element = this.displayItem[indexes.from];

    console.log('element', element);

    this.displayItem.splice(indexes.from, 1);
    console.log('deleted:', this.displayItem);

    this.displayItem.splice(indexes.to, 0, element);
    console.log('after', this.displayItem)


  }

  //show delete confirmation
  showConfirm(index, title) {
    let confirm = this.alertCtrl.create({
      title: `Are your sure want to delete ${title}?`,
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.haptic.acoustic();

            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.haptic.acoustic();

            console.log('Agree clicked');
            this.dataProvider.delete(index);
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }]
    });
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
            this.haptic.acoustic();

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
            this.haptic.acoustic();

            this.dismissLoading();
            prompt.dismiss();
          }
        }
      ]
    });
    prompt.present();
  }

  //error 504
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

  //error connectionTimeout

  addTracking() {
    this.haptic.acoustic();
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
    this.haptic.acoustic();
    this.showLoading();
    this.pos.getDetail(value.trackingNum)
      .timeout(10000)
      .subscribe(result => {
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
          };
          //nak check code ,204 error, 200 ok, 504 "Server SPR terlalu perlahan."
          if (result.code == 200) {
            this.dismissLoading();
            //send data to TrackprogressPage with dataObj
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
        });
  }

  copy(i, trackingNum) {
    this.haptic.acoustic();
    this.clipboard.copy(trackingNum).then(() => {
      let toast = this.toast.create({
        message: 'Copied to clipboard',
        duration: 2000,
        position: 'bottom',
        showCloseButton: true
      });
      toast.present();
    });

  }

  delete(index, title) {
    this.haptic.acoustic();
    // this.value = ;
    // console.log(index);
    this.showConfirm(index, title);
  }

  about() {
    this.haptic.acoustic();
    let modal = this.modalCtrl.create('InfoPage');
    modal.present();
  }

  presentModal() {
    let modal = this.modalCtrl.create('HomeinfoPage');
    modal.present();
  }
}
