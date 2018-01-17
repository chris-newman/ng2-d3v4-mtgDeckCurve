export class Card {
  name: string;
  type: string;
  color: string;
  cost: number;
  amount: number;
  // TODO: add more fields after integrating mtg api

  constructor(cardInfo:any) {
    this.name = cardInfo.name || "";
    this.amount = cardInfo.amount || 1;
    this.color = cardInfo.color;
    this.cost = cardInfo.cost;
    this.type = cardInfo.type;
    if(this.type == 'Land'){
      this.cost = 0;
    }
  }

  // compare to another card object
  equals(otherCard){
    return (this.type === otherCard.type && this.color === otherCard.color && this.cost === otherCard.cost);
  }
}
