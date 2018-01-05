import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div class="container-fluid">
    <h1>{{title}}</h1>
    <router-outlet></router-outlet>
  </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'MTG Deck Curve';
} 
