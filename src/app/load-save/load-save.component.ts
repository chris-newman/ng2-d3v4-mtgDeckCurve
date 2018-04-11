import { Component, OnInit } from '@angular/core';
import { DeckService } from '../core/deck.service';
import { Deck } from '../shared/deck';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "lodash";

@Component({
  selector: 'app-load-save',
  template: `
    
    <div class="modal-header">
      <h4 class="modal-title">Saved Decks</h4> 
      <!--<button (click)="deckService.clearAllDecks()">Clear all Decks</button>-->
      <!--<button type="button" class="close" (click)="modal.close()"></button>-->
    </div>

    <table class="table table-fixed table-sm">
          <thead>
            <tr class="tr-border">
              <th class="col-lg-4">Name</th>
              <th class="col-lg-2">Amount</th>
              <th class="col-6">Colors</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let deck of decks">
              <td class="col-4">{{deck.name}}</td>
              <td class="col-1">{{deck.getLength()}}</td>
              <td class="col-3"> </td>
              <td class="col-4">
                <button class="btn btn-primary" (click)="setDeck(deck)">Load</button>
                <button class="btn btn-dark" (click)="copyDeck(deck)">Copy</button>
                <button class="btn btn-danger" (click)="deleteDeck(deck)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
    
  `,
  styles: [`
    th, td, h4, p, li {
      color: black;
    }
  `
  ]
})
export class DeckLoaderComponent implements OnInit {
  decks: Array<Deck>;
  constructor(private deckService: DeckService, public modal: NgbActiveModal) { }

  ngOnInit() {
    this.getDecks();
  }

  getDecks(){
    this.deckService.getDecks().then((decks : Array<Deck>) => {
      this.decks = decks;
      // console.log(this.decks);
    })
  }

  setDeck(deck){
    deck.restoreCards();
    this.deckService.setDeck(deck);
    console.log(this.deckService.deck);
    this.modal.close();
  }

  copyDeck(deck){
    let newDeck = _.cloneDeep<Deck>(deck);
    newDeck.restoreCards();
    this.deckService.setDeck(newDeck);
    this.deckService.deck.name = ""; // trigger save as modal
    this.deckService.saveDeck(newDeck);
    this.modal.close();
  }

  deleteDeck(deck){
    console.log('deletedeck in component called');
    if (confirm("Are you sure you want to delete this deck?")) {
      this.deckService.deleteDeck(deck).then(() => {
        this.getDecks();
        return;
      })
    }
  }


}
