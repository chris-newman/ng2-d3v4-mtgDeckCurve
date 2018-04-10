import { Injectable } from '@angular/core';
import { Deck } from '../shared/deck';
import { NgForage } from 'ngforage';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeckRenamerComponent } from '../deck-renamer/deck-renamer.component';

@Injectable()
export class DeckService {
  public deck: Deck;
  constructor(private ngf: NgForage, private modalService: NgbModal) { 
    this.deck = new Deck({});
    // this.ngf.clear();
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
    if(deck.name == ""){
      const modalRef = this.modalService.open(DeckRenamerComponent, {
        // windowClass: 'large-dark-modal',
        size: 'sm'
      });
      modalRef.componentInstance.deck = deck;
      modalRef.result.then(() => {
        return this.ngf.setItem(deck.name, deck);
      })
    }
    else{
      return this.ngf.setItem(deck.name, deck);
    }
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
    console.log('deletedeck in service called');
    return this.ngf.removeItem(deck.name);
  }

  clearAllDecks(){
    this.ngf.clear();
  }

}
