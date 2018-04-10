import { Card } from "./card";
import { forEach } from "@angular/router/src/utils/collection";

export class Deck {
  name: string;
  costOpts: any = ['1', '2', '3', '4', '5', '6', '7+'];
  colorOpts: any = ['white', 'black', 'green', 'red', 'blue', 'grey', 'multi'];
  typeOpts: any = ['creature','instant','sorcery','artifact','enchantment','Land'];
  private cards: Array<Card>;

  constructor(deckInfo:any) {
    this.name = deckInfo.name || "";
    this.cards = deckInfo.cards || [];
  }

  getCards(){
    return this.cards;
  }

  getLength(){
    let sum = 0;
    this.cards.forEach(card => {
      sum += card.amount;
    });
    return sum;
    // return this.cards.length;
  }

  addCard(card){ // TODO: validation
    // see if card can be stacked
    let foundIndex = this.cardInDeck(card);
    if(foundIndex != -1){
      // TODO: additional validation once card names are implemented
      if(card.type != 'B. Land' && this.cards[foundIndex].amount == 4) return;
      this.cards[foundIndex].amount++;
    }
    else{
      this.cards.push(card);
    }
  }
  
  // returns the index where the card is found in the deck, -1 if not found
  private cardInDeck(card){
    for(let i = 0; i < this.cards.length; i++){
      if(this.cards[i].equals(card)) return i;
    }
    return -1;
  }


  // delete a card from the deck
  deleteCard(cardToDelete){
    for(let i = 0; i < this.cards.length; i++){
      let card = this.cards[i];
      if(card.name == cardToDelete.name){
        if(this.cards[i].amount > 1){
          this.cards[i].amount --;
        }
        else{
          this.cards.splice(i, 1);
        }
        return;
      }
    }
  }

  // reset the deck to 0 cards
  reset(){
    this.cards = new Array<Card>();
  }

  restoreCards(){
    for (let i = 0; i < this.cards.length; i++) {
      console.log('deck.restore cards');
      //const element = this.cards[i];
      this.cards[i] = new Card(this.cards[i], true);
    }
  }
  
  // returns an array of objects for the d3 stacked barchart
  makeD3ObjectArray(){
    let result = [];
    let opts = ['0', '1', '2', '3', '4', '5', '6', '7+'];
    opts.forEach(costOpt => {
      result.push(this.countColorsForCost(costOpt));
    });
    return result;
  }

  // helper function for makeD3ObjectArray
  private countColorsForCost(cost){
    // account for Land/0cost
    let resultCost = cost;
    if(cost == '0') resultCost = 'Land';

    // initialize result object
    let result: any = {cost: resultCost, white: 0, black: 0, green: 0, red: 0, blue: 0, grey: 0, multi: 0};

    // loop through all cards in the deck, if cost matches, increment color
    this.cards.forEach(card => {
      if(card.cost == cost) result[card.color]+=card.amount;
    });
    return result;
  }

  sortAscendingCost(){
    this.cards.sort(compareCost);
    function compareCost(a, b) {
      if (a.cost < b.cost) return -1;
      if (a.cost > b.cost) return 1;
      return 0;
    }
  }

  // returns an array of single cards (instead of cards with an amount)
  makePlayDeck(){
    let playDeck = [];
    // loop through each card in the deck
    for (let index = 0; index < this.cards.length; index++) {
      const card = this.cards[index];
      const amount = card["amount"];
      // add singleton card to playDeck
      for (let x = 0; x < amount; x++) {
        playDeck.push(card);
      }
    }
    return playDeck;
  }  

  // csv formatted string representation of deck
  toString(){
    let result = "";
    let headerRow = "cost,white,black,green,red,blue,grey,multi\n";
    result += headerRow;
    let colorTotals = this.makeD3ObjectArray();
    // console.log(colorTotals);
    colorTotals.forEach(colorTotal => {
      let row = "";
      const lastIndex = Object.keys(colorTotal).length - 1;
      let i = 0;
      for (const key in colorTotal) {
        if (colorTotal.hasOwnProperty(key)) {
          const element = colorTotal[key];
          row += element;
          if(i !== lastIndex) row+=',';
        }
        i++;
      }
      row += '\n';
      result += row;
    });
    return result;
  }
}