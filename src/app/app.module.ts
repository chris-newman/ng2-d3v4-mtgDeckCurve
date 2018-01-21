import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from './charts/charts.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { routing, appRoutingProviders } from './app.routing';
import { DataService } from './shared/data.service';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    HttpClientModule,
    ChartsModule,
    routing
  ],
  providers: [appRoutingProviders, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
