import { Component, OnInit } from '@angular/core';
import { DeckService } from '../core/deck.service';
import { Deck } from '../shared/deck';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-load-save',
  template: `
    
    <div class="modal-header">
      <h4 class="modal-title">Modal title</h4>
      <!--<button type="button" class="close" (click)="modal.close()"></button>-->
    </div>
    <div class="modal-body">
      <p *ngFor="let deck of decks;" (click)="setDeck(deck)">{{deck.name}} - {{deck.getLength()}}</p>
    </div>
    
  `,
  styles: [`
    h4, p, li {
      color: black;
    }
  `
  ]
})
export class LoadSaveComponent implements OnInit {
  decks: Array<Deck>;
  constructor(private deckService: DeckService, public modal: NgbActiveModal) { }

  ngOnInit() {
    this.deckService.getDecks().then((decks : Array<Deck>) => {
      this.decks = decks;
      console.log(this.decks);
      console.log(this);
    })
  }

  setDeck(deck){

    deck.restoreCards();
    this.deckService.setDeck(deck);
    console.log(this.deckService.deck);

    this.modal.close();
  }


}
