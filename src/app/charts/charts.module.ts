import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarchartComponent } from './barchart/barchart.component';
import { StackedBarchartComponent } from './stacked-barchart/stacked-barchart.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BarchartComponent, StackedBarchartComponent],
  exports: [BarchartComponent, StackedBarchartComponent]
})
export class ChartsModule { }
