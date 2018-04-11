import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeckService } from '../core/deck.service';

@Component({
  selector: 'app-deck-tester',
  template: `
  <div class="card">
    <div class="card-header">
        <h1>Deck Tester - Turn {{turnCount}} (-1 if you went 2nd)</h1>
    </div>
    <div class="card-body">
      <div class="container-fluid">
        <h4>Field</h4>
        <div class="row">
          <div class="col col-full" *ngFor="let card of testField">
            <img class="img-half-size" [src]="card.imageUrl" alt="">
          </div>
        </div>
      </div>
      <div class="container-fluid">
        <h4>Hand</h4>
        <div class="row">
          <div class="col col-full" *ngFor="let card of testHand; let i = index">
            <img class="img-half-size" [src]="card.imageUrl" (click)="playOne(i)" alt="">
          </div>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <button class="btn btn-dark" (click)="newHand()">New Hand</button>
      <button class="btn btn-dark" (click)="mulligan()">Mulligan</button>
      <button class="btn btn-primary" (click)="drawOne()">Draw One</button>
      <span>Cards left in Deck: {{testDeck.length}}</span>
    </div>
  </div>
  `,
  styles: [`
    th, td, h1, p, li, h4, span {
      color: black;
    }
    .inline{
      display: inline;
    }

    .col-full{
      padding: 0px;
      flex-grow: 0;
    }

    .img-half-size{
      width: 167px;
      height: 233px;
      // width: 50%;
      // height: 50%;
    }
  `]
})
export class DeckTesterComponent implements OnInit {
  displayDeckLength: number;
  turnCount: number;
  testHand: Array<any>;
  testDeck: Array<any>;
  testField: Array<any>;
  mulliganCount: number;
  selectedCard: any;

  constructor(public activeModal: NgbActiveModal, private deckService: DeckService) { }

  ngOnInit() {
    this.resetBoardState();
    this.displayDeckLength = this.deckService.deck.getLength();
    this.newHand();
  }

  private resetBoardState(){
    this.turnCount = 1;
    this.testField = [];
    this.selectedCard = null;
    this.mulliganCount = 0;
  }

  setSelectedCard(card: any){
    this.selectedCard = card;
  }

  newHand() {
    this.resetBoardState();

    this.shuffleTestDeck();
    console.log(this.testDeck);
    this.testHand = this.testDeck.splice(-7, 7);
    console.log(this.testHand);
  }

  drawOne() {
    this.turnCount++;
    const card = this.testDeck.pop();
    console.log(card);
    this.testHand.push(card);
    console.log(this.testHand);
    // TODO: new card.name not rendering 
  }

  playOne(index){
    console.log(index)
    let card = this.testHand.splice(index, 1)[0];
    this.testField.push(card);
    console.log(card);
    console.log(this.testField);
  }

  mulligan() {
    this.testField = [];
    this.selectedCard = null;
    if(this.mulliganCount >= 2) return;  
    this.mulliganCount ++;
    this.shuffleTestDeck();
    this.testHand = this.testDeck.splice(0, 7 - this.mulliganCount);
    // TODO: scry(1)
  }

  private shuffleTestDeck() {
    this.testDeck = this.deckService.deck.makePlayDeck();
    for(let i = 0; i < 2; i++){ // shuffle more than once for seemingly better randomness
      this.shuffle(this.testDeck);
    }
  }

  private shuffle(array) {
    let length = array.length;
    let random, temp;

    while (length) {
      random = Math.floor(Math.random() * length--);
      temp = array[length];
      array[length] = array[random];
      array[random] = temp;
    }
  }
}
