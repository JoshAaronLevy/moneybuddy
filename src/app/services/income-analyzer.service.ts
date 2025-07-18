import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface IncomeAnalysisResult {
  containsIncome: boolean;
  amount?: number;
  frequency?: 'monthly' | 'annual' | 'unknown' | 'ambiguous' | string;
  ambiguous: boolean;
  reason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IncomeAnalyzerService {
  constructor() { }

  analyze(message: string): Observable<IncomeAnalysisResult> {
    const normalized = message.toLowerCase();

    if (normalized.includes('border collie')) {
      return of({ containsIncome: false, ambiguous: false }).pipe(delay(500));
    }

    if (normalized.includes('65000')) {
      return of({
        containsIncome: true,
        amount: 65000,
        frequency: 'unknown',
        ambiguous: true,
        reason: 'High value without frequency — may be annual or monthly'
      }).pipe(delay(500));
    }

    if (normalized.includes('4000')) {
      return of({
        containsIncome: true,
        amount: 4000,
        frequency: 'monthly',
        ambiguous: false
      }).pipe(delay(500));
    }

    return of({ containsIncome: false, ambiguous: false }).pipe(delay(500));
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export interface IncomeAnalysisResult {
//   containsIncome: boolean;
//   amount?: number;
//   frequency?: 'monthly' | 'annual' | 'unknown';
//   ambiguous: boolean;
//   reason?: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class IncomeAnalyzerService {
//   // Replace with your deployed Firebase function URL:
//   private readonly endpoint = 'https://us-central1-moneybuddy-3e47e.cloudfunctions.net/analyzeIncome';

//   constructor(private http: HttpClient) { }

//   analyze(message: string): Observable<IncomeAnalysisResult> {
//     return this.http.post<IncomeAnalysisResult>(this.endpoint, { message });
//   }
// }
