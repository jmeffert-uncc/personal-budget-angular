import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ArticleComponent } from '../article/article.component';
import { HttpClient } from '@angular/common/http';
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
import { CommonModule } from '@angular/common';

// Register ALL required Chart.js components
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  PieController
);

@Component({
  selector: 'pb-homepage',
  imports: [
    ArticleComponent,
    CommonModule
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  standalone: true
})
export class HomepageComponent implements OnInit, AfterViewInit {
  @ViewChild('myChart') myChart!: ElementRef;
  private chart: Chart | undefined;
  
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // If we already have data, create the chart
    if (this.dataSource.datasets[0].data.length > 0) {
      this.createChart();
    }
  }

  private loadData(): void {
    this.http.get('http://localhost:3000/budget')
      .subscribe({
        next: (res: any) => {
          console.log('API Response:', res);
          
          // Update data source
          this.dataSource.datasets[0].data = res.data.myBudget.map((item: any) => item.budget);
          this.dataSource.labels = res.data.myBudget.map((item: any) => item.title);
          
          // Only create chart if view is initialized
          if (this.myChart) {
            this.createChart();
          }
        },
        error: (error) => {
          console.error('API Error:', error);
        }
      });
  }

  private createChart(): void {
    if (typeof window === 'undefined') return; // Skip if not in browser
    
    const canvas = this.myChart?.nativeElement;
    if (!canvas) {
      console.error('Canvas element not found!');
      return;
    }

    try {
      // Destroy existing chart if it exists
      if (this.chart) {
        this.chart.destroy();
      }

      // Create new chart
      this.chart = new Chart(canvas, {
        type: 'pie',
        data: this.dataSource,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Budget Distribution'
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }
}
