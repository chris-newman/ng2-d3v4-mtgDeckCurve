export class Card {
  name: string;
  type: string;
  color: string;
  cost: number;
  amount: number;
  imageUrl: string;

  // TODO: add more fields after integrating mtg api

  /* NOTE: color identies
    W: white
    U: blue
    B: black
    G: green
    R: red
    undefined: grey/artifacts (property doesnt exist if grey)

    may have multiple color identities (Hostage taker is blue and black ['U', 'B'])
  */

  //  TODO: handle creating cards from API data
  constructor(cardInfo:any) {
    this.name = cardInfo.name || "";
    this.amount = cardInfo.amount || 1;

    // TODO: remove if - else, and only use cards from the api

    if(cardInfo.color){
      this.color = cardInfo.color;
    }
    else{
      this.color = parseColor(cardInfo.colorIdentity);
    }
    
    if(cardInfo.cost){
      this.cost = cardInfo.cost;
    }
    else{
      // TODO: create cost object that has display mana cost (like real card) as well as total cost for chart
      this.cost = parseCost(cardInfo.manaCost); 
    }
    
    
    
    // this.type = cardInfo.type;
    this.type = parseType(cardInfo.type);


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
      if(!manaCost) return 0;
      // convert string an array
      manaCost = manaCost.replace(/{/g, "");
      manaCost = manaCost.replace(/}/g, ",");
      const manaArr = manaCost.split(',');
      // slice off last index which is empty
      manaArr.splice(manaArr.length -1, 1);

      // calculate total cost
      let sum = 0;
      for (let i = 0; i < manaArr.length; i++) {
        const element = manaArr[i];
        switch (element) {
          case 'W': sum ++; break;
          case 'B': sum ++; break;
          case 'R': sum ++; break;
          case 'G': sum ++; break;
          case 'U': sum ++; break;
          default:  sum += +element;  break; // number
        }
      }

      return sum;
    }

    function parseType(type){
      let typeArr = type.split(' ');
      typeArr.map((x) => x.toLowerCase());
      
      // ignore prefixes
      if(typeArr[0] == 'legendary' || typeArr[0] == 'basic') typeArr.splice(0,1);

      // return the first word of the type (creature, land, enchantment, etc...)
      return typeArr[0];
    }
  }


  
  // TODO: modal to show card details

  // compare to another card object
  equals(otherCard){
    return (this.type === otherCard.type && this.color === otherCard.color && this.cost === otherCard.cost);
  }
}
