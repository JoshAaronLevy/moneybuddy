import { Component, EventEmitter, Output } from '@angular/core';
import { IncomeAnalysisResult, IncomeAnalyzerService } from '../../services/income-analyzer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-income-prompt',
  standalone: true,
  template: '',
  imports: [CommonModule]
})
export class IncomePromptComponent {
  @Output() analysisCompleted = new EventEmitter<IncomeAnalysisResult>();

  constructor(private analyzer: IncomeAnalyzerService) { }

  analyzeInput(userMessage: string) {
    this.analyzer.analyze(userMessage).subscribe({
      next: (result) => {
        if (result.containsIncome && !result.ambiguous) {
          // Save to localStorage
          localStorage.setItem('income', JSON.stringify({
            amount: result.amount,
            frequency: result.frequency,
            raw: userMessage
          }));
        }
        this.analysisCompleted.emit(result);
      },
      error: () => {
        this.analysisCompleted.emit({
          containsIncome: false,
          ambiguous: false,
          reason: 'Something went wrong while analyzing your input.'
        });
      }
    });
  }
}
