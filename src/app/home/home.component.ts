import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import {of} from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgbTypeahead, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { Deck } from '../shared/deck';
import { Card } from '../shared/card';
import { DataService } from '../shared/data.service';
import { CardViewerComponent } from '../card-viewer/card-viewer.component';
import { DeckLoaderComponent } from '../load-save/load-save.component';
import { DeckService } from '../core/deck.service';
import { DeckTesterComponent } from '../deck-tester/deck-tester.component';

@Component({
  selector: 'app-home',
  template: `
  
  <ng-template #rt let-r="result" let-t="term">
    {{ r.name}}
    <button (click)="viewCard(r)">b</button>
  </ng-template>

  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-9">
          <h2 class="inline-header">{{displayDeckName()}} - {{deckService.deck.getLength()}}/60 Cards </h2>
          <!--<button type="button" (click)="resetDeck()" class="btn btn-secondary btn-reset">Reset</button>
          <button type="button" (click)="deckService.deck.sortAscendingCost()" class="btn btn-secondary btn-reset">Sort</button>-->
        </div>
        <div class="col-3">
          <div class="float-right">
            <button type="button" (click)="testDeck()" class="btn btn-success">Test</button>
            <button type="button" (click)="deckService.saveDeck(deckService.deck)" class="btn btn-default">Save</button>
            <button type="button" (click)="loadDeck()" class="btn btn-default">Load</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="row small-margin-top">
      <div class="col-lg-6 col-md-12 no-padding">
        <!-- FORM -->
        <form action="">
          <div class="row">
            <div class="col-6 no-padding-right">
              <div class="form-group">
                <input name="typeahead-http" type="text" class="form-control" 
                  [class.is-invalid]="searchFailed" [(ngModel)]="searchedCard" 
                  [ngbTypeahead]="search" placeholder="Search for a Card" [inputFormatter]="formatter"
                  [resultTemplate]="rt" />
                
                <div class="invalid-feedback" *ngIf="searchFailed">Sorry, suggestions could not be loaded.</div>
                
              </div>
            </div>
            <div class="col-1 no-padding">
              <div *ngIf="searching"> 
                <div class="spinner-container">
                  <div class='cssload-inner cssload-one'></div>
                  <div class='cssload-inner cssload-two'></div>
                  <div class='cssload-inner cssload-three'></div>
                  <!--<div class="cssload-inner cssload-four"></div>-->
                  <div class='cssload-inner cssload-green'></div>
                  <div class='cssload-inner cssload-white'></div>
                  <div class='cssload-inner cssload-orange'></div>
                </div>
              </div>
            </div>
            <div class="col no-padding-left">
              <button (click)="addSearchedCard()" class="btn btn-primary ">Add Card</button>
            </div>
          </div>
        </form>

        <!-- DECK TABLE -->
        <table class="table table-fixed table-sm">
          <thead>
            <tr class="tr-border">
            <th class="col-5">Name</th>
              <th class="col-2">Cost</th>
              <th class="col-3">Type</th>
              <th class="col-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let card of deckService.deck.getCards()">
              <td class="col-5"><span class="text-link" (click)="viewCard(card)">{{card.name}}</span></td>
              <td class="col-2">{{card.cost}}</td>
              <td class="col-3">{{card.type}}</td>
              <td class="col-1">{{card.amount}}</td>
              <td class="col-1">
                <a (click)="deleteCard(card)" href="javascript:void(0)" class="badge badge-danger"> - </a>
                <a (click)="addCardToDeck(card)" href="javascript:void(0)" class="badge badge-success">+</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="col-lg-6 col-md-12 ">
        <app-stacked-barchart *ngIf="chartData" 
          [data]="chartData" 
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
  .btn-reset{
    margin-top: -13px;
  }
  .tr-border{
    /*border-bottom: 1px solid white;*/
  }
  .container{
    width: 100%;
  } 
  .inline-header{
    display: inline;
  }

  .small-margin-top{
    margin-top: 15px;
  }

  /*https://bootsnipp.com/snippets/oVlgM   fixed table header*/
  .table-fixed thead {
    width: 100%; 
  }
  .table-fixed tbody {
    height: 410px;
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
  .text-link{
    text-decoration: underline;
    cursor: pointer;
  }

  /* modal styles */
  .dark-modal .modal-content, .large-dark-modal .modal-content{
    background-color: #141011;
    color: white;
  }

  .large-dark-modal .modal-lg{
    max-width: 1200px;
  }
  `
  ],
  encapsulation: ViewEncapsulation.None // in order to correctly apply css class to card viewer modal
})
export class HomeComponent implements OnInit {
  // public deck: Deck;
  chartData: any;
  private chartIndices: Array<any>;
  
  private colorOpts: Array<string>;
  private selectedColor: string;
  private cardTypeOpts: Array<string>;
  private selectedCardType: string;
  private cardCostOpts: Array<string>;
  private selectedCardCost: string;
  private colorValues: Array<string>;

  searchedCard: any;
  searching = false;
  searchFailed = false;
  private hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  formatter = (x: {name: string}) => x.name;

  // TODO: redo access modifiers
  constructor(public deckService: DeckService, private data: DataService, private modalService: NgbModal) {}

  ngOnInit() {
    
    this.chartIndices = ['Land', '1', '2', '3', '4', '5', '6', '7+']
    this.colorOpts = this.deckService.deck.colorOpts;
    this.cardTypeOpts = this.deckService.deck.typeOpts;
    this.cardCostOpts = this.deckService.deck.costOpts;
    this.colorValues = ['#f2f9f8', '#1b2223', '#107c41', '#e6452d', '#137fb8', '#cbc2bf', '#c2b26b'];
    this.resetDeck();
  }

  displayDeckName(){
    if(this.deckService.deck.name != "") return this.deckService.deck.name;
    return "Unsaved Deck";
  }

  // watch the input value of card type
  checkCardType(newType){
    if(newType == 'Land') this.selectedCardCost = '0';
  }

  // ==================================================================================================
  // button functions
  // ==================================================================================================
  // x (pill) button fn
  deleteCard(cardToDelete){
    this.deckService.deck.deleteCard(cardToDelete);
    this.updateChartData();
  }

  // add button fn
  public inputData() {
    let input: any = {};
    input.cost = this.selectedCardCost;
    input.color = this.selectedColor;
    input.type = this.selectedCardType;

    let card = new Card(input);
    this.addCardToDeck(card);
  }

  // wip
  addSearchedCard(){
    let card = new Card(this.searchedCard);
    console.log(this.searchedCard);
    this.addCardToDeck(card);
  }

  addCardToDeck(card){
    this.deckService.deck.addCard(card);
    this.updateChartData();
  }

  // reset button fn
  public resetDeck() {
    this.deckService.deck.reset();
    this.updateChartData();
  }

  // clear button fn
  public clearInputs(){
    this.selectedCardCost = "";
    this.selectedCardType = "";
    this.selectedColor = "";
  }

  // ==================================================================================================
  // helper functions
  // ==================================================================================================
  // method required to update chart rendering due to onChanges implementation in chart component
  private updateChartData() {
    this.chartData = this.deckService.deck.makeD3ObjectArray();
  }

  // ==================================================================================================
  // typeahead code - integrated mtg api, using ngbtypeahead with http request
  // ==================================================================================================

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.data.searchCards(term)
          .do(() => this.searchFailed = false)
          // .do((x) => console.log(x))
          .catch(() => {
            this.searchFailed = true;
            return of([]);
          }))
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed)


  // ==================================================================================================
  // ngb modal code
  // ==================================================================================================
  viewCard(card: Card){
    const modalRef = this.modalService.open(CardViewerComponent, {
      windowClass: 'dark-modal',
      size: 'sm'
    });
    modalRef.componentInstance.card = card;
  }

  testDeck(){
    const modalRef = this.modalService.open(DeckTesterComponent, {
      windowClass: 'large-dark-modal',
      size: 'lg'
    });
  }

  loadDeck(){
    const modalRef = this.modalService.open(DeckLoaderComponent, {
      // windowClass: 'dark-modal',
      size: 'lg'
    });
    // modalRef.componentInstance.card = card;
    modalRef.result.then(() => {
      this.updateChartData();
    })
    .catch((err) => {
      if(err != 0) console.log(err);
    })
    ;
  }
      
}

