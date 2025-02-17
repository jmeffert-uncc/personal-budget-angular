import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BudgetItem {
  title: string;
  budget: number;
}

interface BudgetResponse {
  data: {
    myBudget: BudgetItem[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSource = new BehaviorSubject<BudgetItem[]>([]);
  data$ = this.dataSource.asObservable();
  private dataLoaded = false;

  constructor(private http: HttpClient) {}

  fetchData() {
    if (!this.dataLoaded) {
      this.http.get<BudgetResponse>('http://localhost:3000/budget')
        .subscribe({
          next: (res) => {
            console.log('Data received:', res); // Debug log
            if (res && res.data && res.data.myBudget && Array.isArray(res.data.myBudget)) {
              this.dataSource.next(res.data.myBudget);
              this.dataLoaded = true;
            }
          },
          error: (error) => {
            console.error('Error fetching budget data:', error);
          }
        });
    }
  }
}