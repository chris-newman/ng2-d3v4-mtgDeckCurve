import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../shared/card';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
  selector: 'app-card-viewer',
  template: `
  <div class="row">
    <div class="col-4">
      <img class="card-img" [src]="card.imageUrl" alt="">
    </div>
    <div class="col no-padding-left">
      <p>Card Details</p>
    </div>
  </div>
  `,
  styles: [`
    .card-img{
      width: 223px;
      height: 311px;
    } 
  `]
})
export class CardViewerComponent implements OnInit {
  @Input() card: Card;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    console.log(this.card);
  }

}
