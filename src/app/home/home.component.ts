import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { BarchartComponent } from './charts/barchart/barchart.component';

@Component({
  selector: 'app-home',
  template: `
  <h3>{{deck.length}}/60 Cards </h3>
  <div class="container-fluid">
    <div class="row">
      <div class="col-6">
        <!-- FORM -->
        <form (submit)="inputData()">
          <div class="row">
            <div class="col-2 form-group">
              <label for="color">Color:</label>
              <!--// <select [(ngModel)]="selectedColor" name="color" class="form-control">
              //   <option *ngFor="let i of colorOpts" [value]="i">{{i}}</option>
              // </select> -->
              <input id="typeahead-basic" type="text" class="form-control" [(ngModel)]="selectedColor" [ngbTypeahead]="search"/>

            </div>
    
            <div class="col-2 form-group">
              <label for="cost">Cost:</label>
              <select [(ngModel)]="selectedCardCost" name="cost" class="form-control">
                <option *ngFor="let i of cardCostOpts" [value]="i">{{i}}</option>
              </select>
            </div>
    
            <div class="col-3 form-group">
              <label for="type">Type:</label>
              <select [(ngModel)]="selectedCardType" name="type" class="form-control">
                <option *ngFor="let i of cardTypeOpts" [value]="i">{{i}}</option>
              </select>
            </div>
            <div class="col-3 offset-2">
              <button type="submit" class="btn btn-primary btn-add">Add</button>
              <button type="button" (click)="clearData()" class="btn btn-secondary btn-add">Reset</button>
            </div>
          </div>
        </form>
        <!-- DECK TABLE -->
        <table class="table table-fixed table-sm">
          <thead>
            <tr class="tr-border">
              <th class="col-lg-2">Color</th>
              <th class="col-lg-2">Cost</th>
              <th class="col-lg-8">Type</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let card of deck">
              <td class="col-2">{{card.color}}</td>
              <td class="col-2">{{card.cost}}</td>
              <td class="col-3">{{card.type}}</td>
              <td class="col-5"><a (click)="deleteCard(card)" href="javascript:void(0)" class="badge badge-danger">X</a></td>
            </tr>
          </tbody>
        </table>
      </div>
     <!-- // <div class="col-6">
      //   <app-barchart *ngIf="chartData" [data]="chartData"></app-barchart>
      // </div> -->
      
      <div class="col-6">
        <app-stacked-barchart *ngIf="deckStringData" 
          [data]="deckStringData" 
          [segments]="colorOpts"
          [segmentColors]="colorValues"
          [xIndices]="chartIndices"></app-stacked-barchart>
      </div> 
    </div>
  </div>
  
  
  `,
  styles: [
    `
  .btn-add{
    margin-top: 32px;
  }
  .tr-border{
    /*border-bottom: 1px solid white;*/
  }
  .container{
    width: 100%;
  } 

  /*https://bootsnipp.com/snippets/oVlgM   fixed table header*/
  .table-fixed thead {
    width: 100%; 
  }
  .table-fixed tbody {
    height: 420px;
    overflow-y: auto;
    width: 100%;
  }
  .table-fixed thead, .table-fixed tbody, .table-fixed tr, .table-fixed td, .table-fixed th {
    display: block;
  }
  .table-fixed tbody td, .table-fixed thead > tr> th {
    float: left;
    border-bottom-width: 0;
  }
  `
  ]
})
export class HomeComponent implements OnInit {
  private chartData: Array<any>;
  private deckStringData: any;
  private chartIndices: Array<any>;
  private totalCards: number;
  private colorOpts: Array<string>;
  private selectedColor: string;
  private cardTypeOpts: Array<string>;
  private selectedCardType: string;
  private cardCostOpts: Array<string>;
  private selectedCardCost: string;
  private colorValues: Array<string>;

  private deck: Array<any>;

  constructor() {}

  ngOnInit() {
    console.log('demo component');
    this.chartData = [];
    this.deck = [];
    this.chartIndices = ['Land', '1', '2', '3', '4', '5', '6', '7+'];
    this.colorOpts = [
      'white', 'black', 'green', 'red', 'blue', 'grey', 'multi' //TODO: change multi implementation
    ];
    this.cardTypeOpts = [
      'creature',
      'instant',
      'sorcery',
      'artifact',
      'enchantment',
      'Land'
    ];
    this.cardCostOpts = ['1', '2', '3', '4', '5', '6', '7+'];
    //this.colorValues = ["#f2f9f8", "#1b2223", "#397701", "#1f40df", "#cc931b", "#cbc2bf", "#6fc2de" ]; //"#cbc2bf",  grey
    this.colorValues = ['#f2f9f8', '#1b2223', '#107c41', '#e6452d', '#137fb8', '#cbc2bf', '#c2b26b'];
    this.totalCards = 0;
    this.clearData();
  }

  // add button fn
  public inputData() {
    console.log('input data');
    // if(this.deck.length >= 60) return;
    // push card data into deck
    let card: any = {};
    // hard code rule that Lands cost 0, will accept just type == 'Land' && color
    if (this.selectedCardType == 'Land' && this.selectedColor) {
      card.cost = 0;
      card.color = this.selectedColor;
      card.type = this.selectedCardType;
      this.addCard(card);
      // translate deck

    } else if (
      this.selectedCardCost &&
      this.selectedCardType &&
      this.selectedColor
    ) {
      card.cost = this.selectedCardCost;
      card.color = this.selectedColor;
      card.type = this.selectedCardType;
      this.addCard(card);
      // translate deck
    }
  }

  // add card to table and chart data
  private addCard(card) {
    console.log('add card');
    // push card to deck (table)
    this.deck.push(card);

    // add to chart data
    if (card.type == 'Land') {
      this.modData('Land', true);
    } else {
      this.modData(card.cost, true);
    }
  }

  // reset button fn
  public clearData() {
    console.log('clear');
    this.chartData = [];
    this.deck = [];
    // start out with an empty curve
    for (let i = 0; i < this.chartIndices.length; i++) {
      let el = this.chartIndices[i];
      this.chartData.push([el, 0]);
    }
    // switching to array of objects instead of csv string
    this.deckStringData = this.countColorTotals();
  }

  // method for inserting or removing data into chart data structure
  private modData(col, increase) {
    let newData = this.chartData;
    // find index to increment
    for (let i = 0; i < newData.length; i++) {
      if (newData[i][0] == col) {
        console.log('found');
        if (increase) {
          newData[i][1]++;
        } else {
          if (newData[i][1] > 0) {
            newData[i][1]--;
          }
        }
      }
    }
    this.updateData(newData);
  }

  // method required to update chart rendering due to onChanges implementation in chart component
  private updateData(newData) {
    this.chartData = [];
    // switching to array of objects instead of csv string
    this.deckStringData = this.countColorTotals();
    //this.deckStringData = this.deckToString();
    
   
    for (let i = 0; i < newData.length; i++) {
      this.chartData.push(newData[i]);
    }

    let newStackedData = this.countColorTotals();
  }

  // json output of deck for dev purposes
  displayDeck() {
    return this.deckToString();
  }


  // form input functions
  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 2 ? []
        : this.colorOpts.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));


  // ==================================================================================================
  // deck functions
  // ==================================================================================================

  deleteCard(cardToDelete){
    for(let i = 0; i < this.deck.length; i++){
      let card = this.deck[i];
      if(card.cost == cardToDelete.cost && card.type == cardToDelete.type && card.color == cardToDelete.color){
        this.deck.splice(i, 1);
        this.modData(card.cost, false);
        break;
      }
    }
    // this.updateData(this.deck);
  }

  // return an array of objects that have color totals for each costOpt
  countColorTotals(){
    let result = [];
    let opts = ['0'].concat(this.cardCostOpts);
    opts.forEach(costOpt => {
      result.push(this.countColorsForCost(costOpt));
    });
    return result;
  }

  // given a cost (x-axis on chart), return a stackedBar object with the totals for each color
  countColorsForCost(cost){
    // account for Land/0cost
    let resultCost = cost;
    if(cost == '0') resultCost = 'Land';

    // initialize result object
    let result: any = {cost: resultCost, white: 0, black: 0, green: 0, red: 0, blue: 0, grey: 0, multi: 0};

    // loop through all cards in the deck, if cost matches, increment color
    this.deck.forEach(card => {
      if(card.cost == cost) result[card.color]++;
    });
    return result;
  }

  // csv formatted string for d3
  deckToString(){
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
