import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';


@Injectable()
export class DataProvider {
   data=[];

  constructor(public http: Http, public storage: Storage) {
    // this.storage.clear();
    this.storage.get('todos').then((result) => {
      this.data = result;
    })
  }

  getData() {
    return this.storage.get('todos');
  }

  save(dataObj) {
    // let newData = dataObj;
    console.log('current dataObj=>',dataObj);
    if (!this.data) {
      this.data = [dataObj];
      this.storage.set('todos', this.data);
    } else {
      this.data.push( dataObj );
      console.log('new data array=>',this.data);
      this.storage.set('todos', this.data);
      
    }
  }

  delete(index) {
    this.data.splice(index, 1);
    this.storage.set("todos",this.data);
    // console.log(this.storage.get('todos'));
  }

}
