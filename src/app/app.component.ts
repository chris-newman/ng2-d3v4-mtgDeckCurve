import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <nav class="navbar navbar-dark bg-black navbar-space">
    <span class="navbar-brand mb-0 h1">{{title}}</span>
  </nav>
  <div class="container-fluid">
    <router-outlet></router-outlet>
  </div>
  `,
  styles: [`
  .navbar-space{
    margin-bottom: 13px;
  }
  .bg-black{
    background-color: black;
    border-bottom: 1px solid #585858;
  }
  
  `]
})
export class AppComponent {
  title = 'MTG Deck Curve';
} 
