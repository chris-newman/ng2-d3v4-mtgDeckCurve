import { Card } from "./card";

export class Deck {
  costOpts: any = ['1', '2', '3', '4', '5', '6', '7+'];
  colorOpts: any = ['white', 'black', 'green', 'red', 'blue', 'grey', 'multi'];
  typeOpts: any = ['creature','instant','sorcery','artifact','enchantment','Land'];
  name: string;
  private cards: Array<Card>;

  constructor(deckInfo:any) {
    this.name = deckInfo.name;
    this.cards = deckInfo.cards;
  }

  getLength(){
    return this.cards.length;
  }

  addCard(card){
    // TODO: validation
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

  reset(){
    this.cards = new Array<Card>();
  }

  // TODO: save fn
  save(){
    // use local storage
  }
  
  // rename to getD3ObjectArray
  countColorTotals(){
    let result = [];
    let opts = ['0', '1', '2', '3', '4', '5', '6', '7+'];
    opts.forEach(costOpt => {
      result.push(this.countColorsForCost(costOpt));
    });
    return result;
  }

  // helper function for countColorTotals
  private countColorsForCost(cost){
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

  // csv formatted string for d3
  toString(){
    let result = "";
    let headerRow = "cost,white,black,green,red,blue,grey,multi\n";
    result += headerRow;
    let colorTotals = this.countColorTotals();
    console.log(colorTotals);
    colorTotals.forEach(colorTotal => {
      // assuming that keys are still in order
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