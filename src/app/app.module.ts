import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from './charts/charts.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgForageModule } from "ngforage";


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { routing, appRoutingProviders } from './app.routing';
import { DataService } from './shared/data.service';
import { CardViewerComponent } from './card-viewer/card-viewer.component';
import { DeckLoaderComponent } from './load-save/load-save.component';
import { CoreModule } from './core/core.module';
import { DeckTesterComponent } from './deck-tester/deck-tester.component';
import { DeckRenamerComponent } from './deck-renamer/deck-renamer.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CardViewerComponent,
    DeckLoaderComponent,
    DeckTesterComponent,
    DeckRenamerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    NgForageModule,
    HttpClientModule,
    CoreModule,
    ChartsModule,
    routing
  ],
  providers: [appRoutingProviders, DataService],
  bootstrap: [AppComponent],
  entryComponents: [CardViewerComponent, DeckLoaderComponent, DeckTesterComponent, DeckRenamerComponent]
})
export class AppModule { }
