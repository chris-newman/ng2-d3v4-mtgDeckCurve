import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';


@Injectable()
export class DataService {

  constructor(private http: HttpClient) { }

  searchCards(name){ 
    console.log('http call');
    let params = new HttpParams().set('name', name);
    return this.http
    .get('https://api.magicthegathering.io/v1/cards', {params: params})
    .map(response => response['cards']
      .filter((x) => {
        if(x.rarity == 'Basic Land' && x.set != 'UST') return false; // full art basic lands
        else if (x.imageUrl != undefined) return true;  // only cards with imageUrls
      }
    ))
  };
}
