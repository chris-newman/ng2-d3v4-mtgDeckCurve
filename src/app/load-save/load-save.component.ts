import { Component, OnInit } from '@angular/core';
import { DeckService } from '../core/deck.service';
import { Deck } from '../shared/deck';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-load-save',
  template: `
    <div class="container">
      <p>
        load-save works!
      </p>
      <p *ngFor="let deck of decks;" (click)="deckService.setDeck(deck); modal.close();">{{deck.name}} - {{deck.getLength()}}</p>
    </div>
    
  `,
  styles: [`
    p, li {
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


}
