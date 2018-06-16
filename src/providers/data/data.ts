import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class DataProvider {
  data = [];
  observableData: BehaviorSubject<any[]>;

  constructor(public http: Http, public storage: Storage) {
    // this.storage.clear();
    this.getData
      // this.storage.get('tracking')
      .subscribe((result) => {
        this.data = result;
      })
  }

  // getData() {
  //   return this.storage.get('tracking')
  //   .then((result) => {
  //   // this.data = result;
  //   this.observableData = result;
  // })
  // console.log(' this.observableData', this.observableData)
  // }

  getData: Observable<any> = Observable.fromPromise(this.storage.get('tracking').then(data => {
    //maybe some processing logic like JSON.parse(token)
    console.log('observble data:', data);
    return data;
  }));

  save(dataObj) {
    // let newData = dataObj;
    console.log('current dataObj=>', dataObj);
    if (!this.data) {
    console.log('this.data',this.data);
    
      this.data = [dataObj];
      this.storage.set('tracking', this.data);
    } else {
    console.log('else this.data',this.data);
    
      this.data.push(dataObj);
      this.storage.set('tracking', this.data);
    }
  }

  delete(index) {
    this.data.splice(index, 1);
    this.storage.set("tracking", this.data);
    // console.log(this.storage.get('tracking'));
  }

}
