import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { IntroStepperComponent } from '../intro-stepper/intro-stepper.component';

type PromptKey = 'income' | 'debt' | 'expenses' | 'savings';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  private dialog = inject(MatDialog);
  corePrompts: { key: PromptKey; label: string }[] = [
    { key: 'income', label: 'Net Income' },
    { key: 'debt', label: 'Debt' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'savings', label: 'Savings' },
  ];
  savedChats = [
    { id: 'holiday-budget', title: 'Holiday Gift Budget' },
    { id: 'vacation-plan', title: 'Vacation Plan' }, // Add more mock chats as needed
  ];
  statusMap: Record<PromptKey, boolean> = {
    income: false,
    debt: true,
    expenses: false,
    savings: true,
  };

  getStatusClass(key: PromptKey): string {
    return this.statusMap[key] ? 'ok' : 'warning';
  }

  getStatusEmoji(key: PromptKey): string {
    return this.statusMap[key] ? '✅' : '⚠️';
  }

  openPromptChat(key: string) {
    console.log(`Opening prompt chat for: ${key}`);
    // In future: this.router.navigate(['/chat', key])
    // or trigger chat panel state update
  }

  openChatLog(chatId: string) {
    console.log(`Opening saved chat: ${chatId}`);
    // In future: this.router.navigate(['/chat-log', chatId])
  }

  openIntroModal() {
    this.dialog.open(IntroStepperComponent, {
      maxWidth: '1200px',
      disableClose: true,
    });
  }
}
