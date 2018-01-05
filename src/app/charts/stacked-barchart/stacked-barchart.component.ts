import { Component, OnInit, ViewEncapsulation, ViewChild, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-stacked-barchart',
  template: 
  `
  <div class="d3-chart" #chart></div>
  `,
  styles: [`
  .d3-chart {
    width: 100%;
    height: 550px;
  }
  
  .d3-chart .axis path, .d3-chart .axis line {
    stroke: #999;
  }
  
  .d3-chart .axis text {
    fill: #999;
  }  
  `],
  encapsulation: ViewEncapsulation.None
})
export class StackedBarchartComponent implements OnInit {
  @ViewChild('chart') private chartContainer: ElementRef;
  // TODO: abstraction between 2d array for d3 and a json structure for other components.
  @Input() private data: Array<any>;
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
  
  constructor() { }

  ngOnInit() {
    this.createChart();
    // if (this.data) {
    //   this.updateChart();
    // }
  }

  ngOnChanges() {
    // if (this.chart) {
    //   this.updateChart();
    // }
  }

  createChart(){
    let element = this.chartContainer.nativeElement;

    // margin conventions as per https://bl.ocks.org/mbostock/3019563
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    let svg = d3.select(element)
      .append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', element.offsetHeight)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // x and y scales
    let x = d3.scaleLinear()
      .range([0, this.width]);

    let y = d3.scaleLinear()
      .range([this.height, 0]);

    // color scale for stacked bars
    let z = d3.scaleOrdinal()
      .range(["white", "blue", "black", "red", "green"])
    
      // d3.csv("fdsa", function(d, i, columns){return d}, function(error, data){})
      
  }
}

/*
var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

d3.csv("data.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  data.sort(function(a, b) { return b.total - a.total; });
  x.domain(data.map(function(d) { return d.State; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.State); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Population");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});

*/