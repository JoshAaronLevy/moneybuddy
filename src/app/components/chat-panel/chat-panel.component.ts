import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  signal,
  effect,
  inject,
  runInInjectionContext,
  Injector,
  WritableSignal,
  ViewContainerRef,
  ComponentRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { IncomePromptComponent } from '../income-prompt/income-prompt.component';

type MessageType = 'text' | 'component';

interface ChatMessage {
  sender: 'user' | 'bot';
  type: MessageType;
  text?: string;
  component?: any;
}

@Component({
  selector: 'app-chat-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class ChatPanelComponent implements AfterViewInit {
  private injector = inject(Injector);
  userInput = '';
  expectingIncomeInput = true;

  @ViewChild('chatThread') chatThreadRef!: ElementRef<HTMLDivElement>;
  @ViewChild('incomeLogicContainer', { read: ViewContainerRef }) incomeContainerRef!: ViewContainerRef;
  private incomeComponentRef?: ComponentRef<IncomePromptComponent>;

  messages: WritableSignal<ChatMessage[]> = signal([]);

  ngAfterViewInit() {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.messages();
        setTimeout(() => this.scrollToBottom(), 0);
      });
    });

    this.messages.update(() => [
      { sender: 'bot', type: 'text', text: 'Welcome! Let’s get started with your finances.' },
      { sender: 'bot', type: 'text', text: 'First, what is your monthly net income after taxes?' }
    ]);

    // Create the logic-only component (not rendered visibly)
    this.incomeComponentRef = this.incomeContainerRef.createComponent(IncomePromptComponent);
    this.incomeComponentRef.instance.analysisCompleted.subscribe((result) => {
      if (result.containsIncome && !result.ambiguous) {
        this.addBotMessage(`✅ Got it! I've saved your income as $${result.amount} ${result.frequency ? `(${result.frequency})` : ''}.`);
        this.expectingIncomeInput = false;
        // You could now trigger the debt prompt here
      } else if (result.ambiguous) {
        this.addBotMessage(`Sorry, I need a little clarification. ${result.reason}`);
      } else {
        this.addBotMessage(`That doesn't appear to be income-related. Please try again.`);
      }
    });
  }

  sendMessage() {
    const trimmed = this.userInput.trim();
    if (!trimmed) return;

    this.messages.update((msgs) => [...msgs, { sender: 'user', type: 'text', text: trimmed }]);

    if (this.expectingIncomeInput && this.incomeComponentRef) {
      this.incomeComponentRef.instance.analyzeInput(trimmed);
    } else {
      // Future: Route to next step (e.g. debt prompt)
      this.addBotMessage("Thanks! I'll use that to calculate your affordability.");
    }

    this.userInput = '';
  }

  private scrollToBottom() {
    const container = this.chatThreadRef?.nativeElement;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  addBotMessage(text: string) {
    this.messages.update((msgs) => [...msgs, { sender: 'bot', type: 'text', text }]);
  }
}
