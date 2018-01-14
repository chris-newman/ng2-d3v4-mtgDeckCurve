import { Card } from "./card";

export class Deck {
  name: string;
  cards: Array<Card>;


  constructor(deckInfo:any) {
    this.name = deckInfo.name;
    this.cards = deckInfo.cards;
  }

  addCard(card){
    this.cards.push(card);
  }

  deleteCard(cardToDelete){
    for(let i = 0; i < this.cards.length; i++){
      let card = this.cards[i];
      if(card.cost == cardToDelete.cost && card.type == cardToDelete.type && card.color == cardToDelete.color){
        return this.cards.splice(i, 1);
        // this.modData(card.cost, false);
      }
    }
    return null;
    // this.updateData(this.deck);
  }

  countColorsForCost(cost){
    // account for Land/0cost
    let resultCost = cost;
    if(cost == '0') resultCost = 'Land';

    // initialize result object
    let result: any = {cost: resultCost, white: 0, black: 0, green: 0, red: 0, blue: 0, grey: 0, multi: 0};

    // loop through all cards in the deck, if cost matches, increment color
    this.cards.forEach(card => {
      if(card.cost == cost) result[card.color]++;
    });
    return result;
  }

  reset(){
    this.cards = new Array<Card>();
  }
}