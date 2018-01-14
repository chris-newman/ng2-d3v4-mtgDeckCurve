export class Card {
  name: string;
  type: string;
  color: string;
  cost: number;
  // TODO: add more fields after integrating mtg api

  constructor(cardInfo:any) {
    this.name = cardInfo.name;
    this.type = cardInfo.type;
    this.color = cardInfo.color;
    this.cost = cardInfo.cost;
  }
}
