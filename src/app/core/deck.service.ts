import { Injectable } from '@angular/core';
import { Deck } from '../shared/deck';
import { NgForage } from 'ngforage';

@Injectable()
export class DeckService {
  public deck: Deck;
  constructor(private ngf: NgForage) { 
    this.deck = new Deck({});
  }
  

  // set the deck in the service
  setDeck(deck: Deck){
    this.deck = deck;
  }

  // save deck to local storage. returns a promise
  saveDeck(deck: Deck){
    console.log('save deck');
    console.log(deck);
    console.log(deck.getLength());
    return this.ngf.setItem(deck.name, deck);
  }

  // return list of decks. returns a promise
  getDecks(): Promise<Deck[]>{
    return this.ngf.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        return this.ngf.getItem(key).then((data)=>{ // localforage can only store Objects
          return new Deck(data);
        });
      }));
    });
  }

  // delete a deck from local storage
  deleteDeck(deck: Deck){
    this.ngf.removeItem(deck.name);
  }

}
