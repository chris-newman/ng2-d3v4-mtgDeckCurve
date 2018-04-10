import { Component, OnInit, Input } from '@angular/core';
import { Deck } from '../shared/deck';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deck-renamer',
  template: `
    <div class="card">
      <div class="card-header">
        Save As
      </div>
      <div class="card-body">
        <input type="text" [(ngModel)]="newName" placeholder="Deck Name">
      </div>
      <div class="card-footer">
        <div class="float-right">
          <button class="btn btn-primary" (click)="saveAs()">Save</button>
          <button class="btn btn-dark" (click)="cancel()">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    div, th, td, h1, h4, p, li {
      color: black;
    }
    .float-right{
      float:right;
    }
  `]
})
export class DeckRenamerComponent implements OnInit {
  @Input() deck: Deck;
  newName: string;
  constructor(public modal: NgbActiveModal) { }

  ngOnInit() {
  }

  saveAs(){
    if(this.newName && this.newName.length > 0){
      this.deck.name = this.newName;
      this.modal.close();
    }
  }

  cancel(){
    this.modal.dismiss();
  }

}
