import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  Input,
  ElementRef
} from '@angular/core';
import * as d3 from 'd3';
import {
  Selection,
  ScaleLinear,
  ScaleOrdinal,
  EnterElement,
  ScaleBand
} from 'd3';

@Component({
  selector: 'app-stacked-barchart',
  template: `
  <div class="d3-chart" #sbchart></div>
  `,
  styles: [
    `
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
  `
  ],
  encapsulation: ViewEncapsulation.None
})
export class StackedBarchartComponent implements OnInit {
  @ViewChild('sbchart') private chartContainer: ElementRef;
  // TODO: abstraction between 2d array for d3 and a json structure for other components.
  @Input() private data: any;
  @Input() private segments: Array<string>
  @Input() private xIndices: Array<string>;

  private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
  private chart: any;
  private width: number;
  private height: number;
  private x :any;
  private y: any;
  private z: any;
  private xAxis: any;
  private yAxis: any;
  private parsedData:any;
  private stack: any;
  private color: any;
  private svg: any;

  constructor() {}

  ngOnInit() {
    this.createChart();
    console.log(this.data);
    if(this.data){
      this.updateChart(this.data, this);
    }
  }

  ngOnChanges() {
    console.log('on changes');
    if (this.chart) {
      console.log('update chart');
      this.updateChart(this.data, this);
    }
  }

  // TODO: remove crap data from this function
  createChart(){
    let element = this.chartContainer.nativeElement;

    // margin conventions as per https://bl.ocks.org/mbostock/3019563
    var margin = this.margin;
    var width = element.offsetWidth - this.margin.left - this.margin.right;
    var height = element.offsetHeight - this.margin.top - this.margin.bottom;

    this.height = height;
    this.width = width;

    var segments = this.segments;
    var xIndices = this.xIndices;

    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    this.chart = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");    

    this.color = d3.scaleOrdinal(["white","black","green","red","blue","grey","khaki"]);

    this.x = d3.scaleBand()
        .rangeRound([0, width])
        .domain(xIndices)
        .padding(.1);

    this.y = d3.scaleLinear()
        .rangeRound([height, 30])
        .domain([0, 30]);

    this.stack = d3.stack()
        .keys(segments)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);
    
  }

  updateChart(data, self){
    // solve scope issues
    var x = self.x;
    var y = self.y;
    var z = self.z;
    var svg = self.svg;
    var segments = self.segments;
    var xIndices = self.xIndices;
    var stack = self.stack;
    var color = self.color;
    var chart = self.chart;
    var margin = self.margin;
    var height = self.height;
    var width = self.width;

    // x & y axis
    var xAxis = svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(${margin.left}, ${margin.top + height})`)
      .call(d3.axisBottom(x));
    var yAxis = svg.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(y));

    // each data column (a.k.a "key" or "series") needs to be iterated over
    segments.forEach(function(key, key_index){

      // TODO: switch out hard coded property for a passed in value
      var bar = chart.selectAll(".bar-" + key)
          .data(stack(data)[key_index], function(d){ return d.data.cost + "-" + key; });

      bar
        .transition()
          .attr("x", function(d){ return x(d.data.cost); })
          .attr("y", function(d){ return y(d[1]); })
          .attr("height", function(d){ return y(d[0]) - y(d[1]); });

      bar.enter().append("rect")
          .attr("class", function(d){ return "bar bar-" + key; })
          .attr("x", function(d){ return x(d.data.cost); })
          .attr("y", function(d){ return y(d[1]); })
          .attr("height", function(d){ return y(d[0]) - y(d[1]); })
          .attr("width", x.bandwidth())
          .attr("fill", function(d){ return color(key); })

      bar.exit().remove();
    });    

  }
}
