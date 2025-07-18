import { Component } from '@angular/core';
import { IncomeAnalysisResult, IncomeAnalyzerService } from '../../services/income-analyzer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-income-prompt',
  templateUrl: './income-prompt.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class IncomePromptComponent {
  userMessage = '';
  result?: IncomeAnalysisResult;
  loading = false;
  error?: string;
  showNext = false;

  constructor(private analyzer: IncomeAnalyzerService) { }

  submit() {
    if (!this.userMessage.trim()) return;

    this.loading = true;
    this.error = undefined;
    this.result = undefined;
    this.showNext = false;

    this.analyzer.analyze(this.userMessage).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;

        if (res.containsIncome && !res.ambiguous) {
          // Save to localStorage
          localStorage.setItem('income', JSON.stringify({
            amount: res.amount,
            frequency: res.frequency,
            raw: this.userMessage
          }));

          this.showNext = true;
        }
      },
      error: () => {
        this.error = 'Error analyzing income. Please try again.';
        this.loading = false;
      }
    });
  }

  goToNextStep() {
    // For now, just log or alert
    console.log('Proceed to debt entry...');
    alert('Moving to debt input...');
  }
}
