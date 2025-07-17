import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  signal,
  effect,
  inject,
  runInInjectionContext,
  Injector
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
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
  messages = signal<ChatMessage[]>([
    { sender: 'bot', text: 'Hello there! What’s your net monthly income?' }
  ]);

  userInput = '';

  @ViewChild('chatThread') chatThreadRef!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.messages();
        setTimeout(() => this.scrollToBottom(), 0);
      });
    });
  }

  sendMessage() {
    const trimmed = this.userInput.trim();
    if (!trimmed) return;

    this.messages.update((msgs) => [...msgs, { sender: 'user', text: trimmed }]);
    this.userInput = '';

    setTimeout(() => {
      this.messages.update((msgs) => [
        ...msgs,
        {
          sender: 'bot',
          text: "Thanks! I'll use that to calculate your affordability."
        }
      ]);
    }, 600);
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
}
