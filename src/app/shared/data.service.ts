import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {

  constructor(private http: HttpClient) { }

  searchCards(){ 
    return this.http
      .get('https://api.magicthegathering.io/v1/cards')
      .toPromise()
  };
}
