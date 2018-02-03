import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';


@Injectable()
export class DataService {

  constructor(private http: HttpClient) { }

  searchCards(name){ 
    console.log('http call');
    let params = new HttpParams().set('name', name);
    return this.http
      .get('https://api.magicthegathering.io/v1/cards', {params: params})
      .map(response => response['cards']) //.slice(0, 10)) // display only 10 results
      .do((x) => console.log(x))
  };
}
