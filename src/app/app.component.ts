import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <nav class="navbar navbar-dark bg-black">
    <span class="navbar-brand mb-0 h1">{{title}}</span>
  </nav>
  <div class="container-fluid main-container-top-margin">
    <router-outlet></router-outlet>
  </div>
  `,
  styles: [`
  .main-container-top-margin{
    margin-top: 13px;
  }
  
  `]
})
export class AppComponent {
  title = 'MTG Sim';
} 
