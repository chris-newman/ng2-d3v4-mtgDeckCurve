export class Card {
  name: string;
  type: string;
  color: string;
  cost: number;
  amount: number;
  imageUrl: string;
  apiData: any;

  // TODO: add more fields after integrating mtg api

  //  TODO: handle creating cards from API data
  constructor(cardInfo:any, restore?: boolean) {

    this.apiData = cardInfo.apiData ; // accounting for restoring card fn in deck

    this.name = cardInfo.name || "";
    this.amount = cardInfo.amount || 1;

    this.imageUrl = cardInfo.imageUrl;

    if(restore){
      this.color = cardInfo.color;
      this.cost = cardInfo.cost;
      this.type = cardInfo.type;
    }
    else{
      this.color = parseColor(cardInfo.colorIdentity);
      // TODO: create cost object that has display mana cost (like real card) as well as total cost for chart
      this.cost = parseCost(cardInfo.manaCost);     
      this.type = parseType(cardInfo.type);
    }


    if(this.type == 'Land'){
      this.cost = 0;
    }

    function parseColor(colorIdentity){
      if(!colorIdentity) return 'grey';
      else if (colorIdentity.length > 1) return 'multi';
      switch (colorIdentity[0]) {
        case 'W': return 'white';
        case 'B': return 'black';
        case 'R': return 'red';
        case 'G': return 'green';
        case 'U': return 'blue';
        default: console.warn('error parsing color: '+ colorIdentity[0]); return null;
      }
    }

    function parseCost(manaCost){
    /* NOTE: color identies
      W: white
      U: blue
      B: black
      G: green
      R: red
      undefined: grey/artifacts (property doesnt exist if grey)
      - may have multiple color identities (Hostage taker is blue and black ['U', 'B'])
    */
      if(!manaCost) return 0;
      // convert string an array
      manaCost = manaCost.replace(/\//g, ""); // account for {R/P} where life can be paid instead
      manaCost = manaCost.replace(/{/g, "");
      manaCost = manaCost.replace(/}/g, ",");
      const manaArr = manaCost.split(',');
      // slice off last index which is empty
      manaArr.splice(manaArr.length -1, 1);

      // calculate total cost
      let sum:any = 0;
      for (let i = 0; i < manaArr.length; i++) {
        const element = manaArr[i];
        switch (element) {
          case 'W': sum ++; break;
          case 'WP': sum ++; break;
          case 'B': sum ++; break;
          case 'BP': sum ++; break;
          case 'R': sum ++; break;
          case 'RP': sum ++; break;
          case 'G': sum ++; break;
          case 'GP': sum ++; break;
          case 'U': sum ++; break;
          case 'UP': sum ++; break;
          case 'X': sum += 3; break; // X cost spells should be fairly high in the curve
          default:  sum += +element;  break; // number
        }
      }
      if(sum >= 7) sum = "7+";
      return sum;
    }

    function parseType(type){
      if(!type) return;
      let typeArr = type.split(' ');

      // ignore prefixes
      if(typeArr[0] == 'Legendary' || typeArr[0] == 'Basic') return typeArr[0].substring(0,1) + '. ' + typeArr[1];

      // return the first word of the type (creature, land, enchantment, etc...)
      return typeArr[0];
    }
  }

  // compare to another card object
  equals(otherCard){
    return (this.name == otherCard.name && this.type === otherCard.type && this.color === otherCard.color && this.cost === otherCard.cost);
  }
}
