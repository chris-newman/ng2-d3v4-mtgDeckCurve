import { Component, OnInit } from '@angular/core';
import { DeckService } from '../core/deck.service';
import { Deck } from '../shared/deck';

@Component({
  selector: 'app-load-save',
  template: `
    <div class="container">
      <p>
        load-save works!
      </p>
      <ul>
      <li *ngFor="let deck of decks;">{{deck.name}} - {{deck.getLength()}}</li>
      </ul>
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
  constructor(private deckService: DeckService) { }

  ngOnInit() {
    this.deckService.getDecks().then((decks : Array<Deck>) => {
      this.decks = decks;
      console.log(this.decks);
    })
  }

}
