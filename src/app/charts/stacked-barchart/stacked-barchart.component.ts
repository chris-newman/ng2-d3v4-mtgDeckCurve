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
  @Input() private data: string;
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
  private chart: any;
  private width: number;
  private height: number;
  // private x: ScaleBand<string>;
  // private y: ScaleLinear<number, number>;
  // private z: ScaleOrdinal<string, {}>;
  private x :any;
  private y: any;
  private z: any;
  private xAxis: any;
  private yAxis: any;
  private parsedData:any;


  private stack: any;
  private color: any;
  private names: any;
  private alphabet: any;
  private svg: any;

  constructor() {}

  ngOnInit() {
    // this.xData = [
    //   'white',
    //   'black',
    //   'green',
    //   'red',
    //   'blue',
    //   'grey',
    //   'multi' //TODO: change multi implementation
    // ];
    // console.log('stacked barchart on init');
    // this.createChart();
    // if (this.data) {
    //   this.parsedData = d3.csvParse(this.data);
    //   // maybe just pass in array of strings instead;
    //   this.updateChart();
    // }
    let element = this.chartContainer.nativeElement;

    // margin conventions as per https://bl.ocks.org/mbostock/3019563
    var margin = this.margin;
    var width = element.offsetWidth - this.margin.left - this.margin.right;
    var height = element.offsetHeight - this.margin.top - this.margin.bottom;
    
    this.alphabet = "abcdef".split("");
    this.names = ["Ann", "Bob", "Jean", "Chuck", "Denise", "Eric", "Frida", "Greg", "Hillary"];

    var alphabet = this.alphabet;
    var names = this.names;


    this.svg = d3.select(element).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f"])

    this.x = d3.scaleBand()
        .rangeRound([0, width])
        .domain(names)
        .padding(.1);

    this.y = d3.scaleLinear()
        .rangeRound([height, 0]);

    this.stack = d3.stack()
        .keys(alphabet)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    var self = this;
    this.redraw(this.randomData(self), self);

    var redraw = this.redraw;
    var randomData = this.randomData;


    d3.interval(function(){
      redraw(randomData(self), self);  
    }, 5000);

    
  }

  redraw(data, self){
    var x = self.x;
    var y = self.y;
    var z = self.z;
    var svg = self.svg;
    var alphabet = self.alphabet;
    var names = self.names;
    var stack = self.stack;
    var color = self.color;

    // update the y scale
    y.domain([0, d3.max(data.map(function(d){ return d.sum }))]);

    // each data column (a.k.a "key" or "series") needs to be iterated over
    alphabet.forEach(function(key, key_index){

      var bar = svg.selectAll(".bar-" + key)
          .data(stack(data)[key_index], function(d){ return d.data.name + "-" + key; });

      bar
        .transition()
          .attr("x", function(d){ return x(d.data.name); })
          .attr("y", function(d){ return y(d[1]); })
          .attr("height", function(d){ return y(d[0]) - y(d[1]); });

      bar.enter().append("rect")
          .attr("class", function(d){ return "bar bar-" + key; })
          .attr("x", function(d){ return x(d.data.name); })
          .attr("y", function(d){ return y(d[1]); })
          .attr("height", function(d){ return y(d[0]) - y(d[1]); })
          .attr("width", x.bandwidth())
          .attr("fill", function(d){ return color(key); })

    });    

  }

  randomData(self){
    var alphabet = self.alphabet;
    var names = self.names;

    return names.map(function(d){
      var obj:any = {};
      obj.name = d;
      var nums = [];
      alphabet.forEach(function(e){
        var num = Math.floor(Math.random() * 10) + 1;
        obj[e] = num;
        nums.push(num);
      });
      obj.sum = d3.sum(nums);
      return obj;
    });
  }



  ngOnChanges() {
    console.log('on changes');
    if (this.chart) {
      this.parsedData = d3.csvParse(this.data);
      console.log('update chart');
      this.updateChart();
    }
  }

  updateChart(){

  }

  // createChart() {
  //   // console.log(this.data);
  //   let element = this.chartContainer.nativeElement;

  //   // margin conventions as per https://bl.ocks.org/mbostock/3019563
  //   this.width = element.offsetWidth - this.margin.left - this.margin.right;
  //   this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

  //   this.svg = d3
  //     .select(element)
  //     .append('svg')
  //     .attr('width', element.offsetWidth)
  //     .attr('height', element.offsetHeight);

  //   this.chart = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");    
    
  //   this.x = d3.scaleBand()
  //   .rangeRound([0, this.width])
  //   .paddingInner(0.05)
  //   .align(0.1);

  //   this.y = d3.scaleLinear()
  //   .rangeRound([this.height, 0]);

  //   this.z = d3.scaleOrdinal()
  //   .range(["#fff", "#000", "green", "red", "blue", "grey", "purple"]);

  //   this.parsedData = d3.csvParse(this.data);
  //   //console.log(parsedData);

  //   // var keys = this.parsedData.columns.slice(1);
  //   this.x.domain(this.parsedData.map(function(d) { return d.cost; }));
  //   this.y.domain([0, 30]).nice(); // hard coding upper limit of 30 for now

  //   // x & y axis
  //   this.xAxis = this.svg.append('g')
  //     .attr('class', 'axis axis-x')
  //     .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
  //     .call(d3.axisBottom(this.x));
  //   this.yAxis = this.svg.append('g')
  //     .attr('class', 'axis axis-y')
  //     .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
  //     .call(d3.axisLeft(this.y));
  // }



  // updateChart() {
  //   var x = this.x;
  //   var y = this.y;
  //   var z = this.z;
  //   var keys = this.parsedData.columns.splice(1);

  //   var stack = d3.stack().keys(keys);

  // }
  
  





}

/*


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


*/

//  // TODO: format deck to a csv string

//   d3.csvFormat([
//     ['land', '1', '2', '3', '4'],
//     []
//   ])
//   let parsedArr = d3.csvParse(
//     'cost,land,1,2,3,4,5,6,7+\n'+
//     'white,24,10,9,8,7,6,5,4');
//   //DSVParsedArray<DSVRowString>
//   console.log('parsedArr');
//   console.log(parsedArr);
//   console.log('parsedArr columns');
//   console.log(parsedArr.columns);

//   var keys = parsedArr.columns.slice(1);
//   console.log(keys);

/* ATTEMPT 1
    createChart(){
    let element = this.chartContainer.nativeElement;

    // margin conventions as per https://bl.ocks.org/mbostock/3019563
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    let svg = d3.select(element)
      .append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', element.offsetHeight);

    // chart plot area
    this.g = svg.append("g")
        .attr('class', 'bars')
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // x, y, color scales
    this.x = d3.scaleLinear().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);
    // TODO: pass color scale in through directive
    this.colorKeys = ["white", "black", "green", "red", "blue", "grey", "multi"];
    this.colorScale = d3.scaleOrdinal().range(this.colorKeys);
    
    // x, y, color domains - assuming that the order of land, 1, 2, 3.... is preserved
    // xScale.domain(this.data.map(d => d.cost));
    // // TODO: may need to have y domain be input to the directive
    // yScale.domain([0, 30]).nice();
    // colorScale.domain(colorKeys);
    let xDomain = this.data.map(d => d.cost);
    console.log(this.data);
    let yDomain = [0, 30];

    // x and y axis
    this.xAxis = svg.append("g")
      .attr('class', 'axis axis-x')
      .attr('transform', "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.x));

    this.yAxis = svg.append("g")
    .attr('class', 'axis axis-y')
    .attr('transform', "translate(0," + this.height + ")")
    .call(d3.axisLeft(this.y));
  }

  updateChart(){
    //update scales and axis
    this.x.domain(this.data.map(d => d.cost));
    this.y.domain([0, 30]);
    this.g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(this.colorKeys)(this.data))
      .enter().append("g")
        //.attr("fill", function(d: any) {return this.colorScale(d.color)})
    
  }
    
    
    
    
    */



    /* ATTEMPT 2
    createChart() {
    let element = this.chartContainer.nativeElement;

    // margin conventions as per https://bl.ocks.org/mbostock/3019563
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    this.svg.selectAll('g').data();

    this.chart = this.svg
      .append('g')
      .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // x and y domains
    console.log(this.data);
    let xDomain = this.data.map(d => d.cost);
    let yDomain = [0, 30]; // hardcoded for now

    // x and y scales
    this.x = d3
      .scaleBand()
      .padding(0.1)
      .domain(xDomain)
      .rangeRound([0, this.width]);
    this.y = d3
      .scaleLinear()
      .domain(yDomain)
      .range([this.height, 0]);

    // TODO: colors
    this.colors = d3.scaleOrdinal().range(this.xData);

    // x and y axis
    this.xAxis = this.svg
      .append('g')
      .attr('class', 'axis axis-x')
      .attr(
        'transform',
        `translate(${this.margin.left}, ${this.margin.top + this.height})`
      )
      .call(d3.axisBottom(this.x));
    this.yAxis = this.svg
      .append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.y));
  }

  updateChart() {
    console.log(this.data);
    let xDomain = this.data.map(d => d.cost);
    // console.log(this.mapStackedData(this.data, this.xData));
    // update scales and axis
    // this.x.domain(this.data.map(d => d.cost));
    this.y.domain([0, 30]);
    this.xAxis.transition().call(d3.axisBottom(this.x));
    this.yAxis.transition().call(d3.axisLeft(this.y));

    // let update = this.chart.selectAll('.bar')
    //   .data(this.data);
    let _data = this.data;
    let abstractData = this.xData.map(function(color) {
      return _data.map(function(d) {
        return { x: d.cost, y: d[color] };
      });
    });

    console.log(abstractData);
    try {
      let stackedLayoutData = d3.stack().keys(this.xData)(abstractData);
      console.log(stackedLayoutData);

      this.x.domain(stackedLayoutData[0].map(d => d['x']));

      let _color = this.colors;
      var layer = this.svg
        .selectAll('.stack')
        .data(stackedLayoutData)
        .enter()
        .append('g')
        .attr('class', 'stack')
        .style('fill', function(d, i) {
          return _color(i);
        });

      let _x = this.x;
      let _y = this.y;
      layer
        .selectAll('rect')
        .data(function(d) {
          return d;
        })
        .enter()
        .append('rect')
        .attr('x', function(d) {
          return _x(d.x);
        })
        .attr('y', function(d) {
          return _y(d.y + d.y0);
        })
        .attr('height', function(d) {
          return _y(d.y0) - _y(d.y + d.y0);
        });
      // .attr("width", this.x.rangeBand());
    } catch (error) {
      console.log(error);
    }
  }
}
    */
