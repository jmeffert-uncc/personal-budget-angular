import { Component, OnInit, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { ArticleComponent } from '../article/article.component';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { ContactComponent } from '../contact/contact.component';
import { D3ChartComponent } from '../d3-chart/d3-chart.component';
import { DataService } from '../data.service';
import { BudgetItem } from '../data.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'pb-homepage',
  imports: [
    ArticleComponent,
    CommonModule,
    BreadcrumbsComponent,
    D3ChartComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  standalone: true
})
export class HomepageComponent implements OnInit {
  @ViewChild('myChart') myChart!: ElementRef;
  chart: any;
  
  public dataSource = {
    datasets: [{
      data: [] as number[],
      backgroundColor: [
        '#ffcd56',
        '#ff6384',
        '#36a2eb',
        '#fd6b19',
      ]
    }],
    labels: [] as string[]
  };

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.dataService.fetchData();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.dataService.data$.subscribe(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          this.createChart(data);
        }
      });
    }
  }

  private createChart(data: any[]) {
    if (!this.myChart || !isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.myChart.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(item => item.title),
        datasets: [{
          data: data.map(item => item.budget),
          backgroundColor: [
            '#98abc5', '#8a89a6', '#7b6888', '#6b486b', 
            '#a05d56', '#d0743c', '#ff8c00'
          ]
        }]
      },
      options: {
        responsive: true
      }
    });
  }
}
