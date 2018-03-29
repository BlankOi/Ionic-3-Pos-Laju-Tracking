import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PosApiProvider {

  constructor(public http: Http) {
    console.log('Hello PosApiProvider Provider');
  }

  getDetail(trackingNum) {
    return this.http.get('https://api.jomgeek.com/v1/poslaju/?k=HoJ0vOxDOqUD1uRA&a=' + trackingNum)
      .map(res => res.json());
  }
}
