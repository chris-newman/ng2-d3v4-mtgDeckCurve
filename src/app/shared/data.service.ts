import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class DataService {

  constructor(private http: HttpClient) { }

  searchCards(name){ 
    console.log('http call');
    let params = new HttpParams().set('name', name);
    return this.http
      .get('https://api.magicthegathering.io/v1/cards', {params: params})
      .map(response => response['cards']);
  };
}
