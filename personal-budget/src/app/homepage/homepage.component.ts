import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ArticleComponent } from '../article/article.component';
import { HttpClient } from '@angular/common/http';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';

// Register the required Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

@Component({
  selector: 'pb-homepage',
  imports: [
    ArticleComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  standalone: true
})
export class HomepageComponent implements OnInit {

  public dataSource = {
    datasets: [
        {
            data: [] as number[],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
            ]
        }
    ],
    labels: [] as string[]
  };

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget').subscribe((res: any) => {
      for (var i = 0; i < res.data.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.data.myBudget[i].budget;
        this.dataSource.labels[i] = res.data.myBudget[i].title;
      }
      this.createChart();
    });
  }

  createChart() {
    if (isPlatformBrowser(this.platformId)) {
      const ctx = document.getElementById('myChart') as HTMLCanvasElement;
      var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
      });
    }
  }
}
