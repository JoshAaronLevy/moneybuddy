import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { IntroStepperComponent } from '../intro-stepper/intro-stepper.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  private dialog = inject(MatDialog);

  openIntroModal() {
    this.dialog.open(IntroStepperComponent, {
      maxWidth: '1200px',
      disableClose: true,
    });
  }
}
