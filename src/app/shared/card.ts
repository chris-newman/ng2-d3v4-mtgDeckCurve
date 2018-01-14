export class Card {
  name: string;
  type: string;
  color: string;
  cost: number;
  // TODO: add more fields after integrating mtg api

  constructor(cardInfo:any) {
    this.name = cardInfo.name || "";
    this.color = cardInfo.color;
    this.cost = cardInfo.cost;
    this.type = cardInfo.type;
    if(this.type == 'Land'){
      this.cost = 0;
    }
  }
}
