import {Component,OnInit,ViewEncapsulation,ViewChild,Input,ElementRef} from '@angular/core';
import * as d3 from 'd3';
import {ScaleLinear,ScaleOrdinal,ScaleBand} from 'd3';

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
  // TODO: expose more inputs for higher reusability
  @Input() private data: any;
  @Input() private segments: Array<string>
  @Input() private xIndices: Array<string>;
  @Input() private segmentColors: Array<string>;

  private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
  private chart: any;
  private width: number;
  private height: number;
  private x :any;
  private y: any;
  private z: any;
  private xAxis: any;
  private yAxis: any;
  private stack: any;
  private color: any;
  private svg: any;

  constructor() {}

  ngOnInit() {
    this.createChart();
    if(this.data){
      this.updateChart(this.data);
    }
  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart(this.data);
    }
  }

  createChart(){
    let element = this.chartContainer.nativeElement;

    // margin conventions as per https://bl.ocks.org/mbostock/3019563
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    this.chart = this.svg
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.color = d3.scaleOrdinal(this.segmentColors);
    this.x = d3.scaleBand()
        .rangeRound([0, this.width])
        .domain(this.xIndices)
        .padding(.1);

    this.y = d3.scaleLinear()
        .rangeRound([this.height, 30])
        .domain([0, 30]);

    this.stack = d3.stack()
        .keys(this.segments)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);
  }

  updateChart(data){
    // x & y axis
    this.svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.x));
    this.svg.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.y));

    // each data column (a.k.a "key" or "series") needs to be iterated over
    this.segments.forEach((key, key_index) => {

      // TODO: switch out hard coded 'cost' property for a passed in value, for reusability
      let bar = this.chart.selectAll(".bar-" + key)
          .data(this.stack(data)[key_index], (d) => d.data.cost + "-" + key);

      bar.transition()
          .attr("x", (d) => this.x(d.data.cost))
          .attr("y", (d) => this.y(d[1]))
          .attr("height", (d) => this.y(d[0]) - this.y(d[1]));

      bar.enter().append("rect")
          .attr("class", (d) => "bar bar-" + key)
          .attr("x", (d) => this.x(d.data.cost))
          .attr("y", (d) => this.y(d[1]))
          .attr("height", (d) => this.y(d[0]) - this.y(d[1]))
          .attr("width", this.x.bandwidth())
          .attr("fill", () => this.color(key))

      bar.exit().remove();
    });    

  }
}
