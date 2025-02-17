import { Component, AfterViewInit, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as d3 from 'd3';
import { DataService, BudgetItem } from '../data.service';

@Component({
  selector: 'pb-d3-chart',
  standalone: true,
  template: `
    <div id="d3Chart"></div>
  `,
  styles: [`
    #d3Chart svg {
      width: 100%;
      height: 400px;
      margin-right: 50px;
    }

    :host ::ng-deep path.slice {
      stroke-width: 2px;
    }

    :host ::ng-deep polyline {
      opacity: .3;
      stroke: black;
      stroke-width: 2px;
      fill: none;
    }
  `]
})
export class D3ChartComponent implements AfterViewInit {
  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dataService: DataService
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.dataService.fetchData();
      this.dataService.data$.subscribe(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          this.createD3Chart({ myBudget: data });
        }
      });
    }
  }

  private createD3Chart(data: { myBudget: BudgetItem[] }) {
    if (!data || !data.myBudget || !Array.isArray(data.myBudget)) {
      return;
    }
    
    const width = 350;
    const height = 400;
    const margin = 80;
    const radius = Math.min(width - margin * 2, height - margin * 2) / 2;

    // Clear previous chart
    d3.select("#d3Chart").html("");

    const svg = d3.select("#d3Chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width/2},${height/2})`);

    const pie = d3.pie<BudgetItem>()
      .sort(null)
      .value(d => d.budget);

    const arc = d3.arc<d3.PieArcDatum<BudgetItem>>()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    const outerArc = d3.arc<d3.PieArcDatum<BudgetItem>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const color = d3.scaleOrdinal<string>()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    const pieData = pie(data.myBudget);

    // Draw slices
    const slice = svg.selectAll(".slice")
      .data(pieData)
      .enter()
      .append("path")
      .attr("class", "slice")
      .attr("d", arc)
      .style("fill", d => color(d.data.title));

    // Add labels
    const text = svg.selectAll(".label")
      .data(pieData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("dy", ".35em");

    function midAngle(d: d3.PieArcDatum<BudgetItem>) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    // Position labels
    text.attr("transform", d => {
      const pos = outerArc.centroid(d);
      pos[0] = radius * (midAngle(d) < Math.PI ? 1.2 : -1.2);
      return `translate(${pos})`;
    })
    .attr("text-anchor", d => midAngle(d) < Math.PI ? "start" : "end")
    .text(d => d.data.title);

    // Add polylines
    const polyline = svg.selectAll(".polyline")
      .data(pieData)
      .enter()
      .append("polyline")
      .attr("class", "polyline")
      .attr("points", d => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [
          arc.centroid(d),
          outerArc.centroid(d),
          pos
        ].join(",");
      });
  }
}
