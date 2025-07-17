import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { IntroService } from '../../services/intro.service';

@Component({
  selector: 'app-intro-stepper',
  standalone: true,
  imports: [CommonModule, MatStepperModule, MatButtonModule],
  templateUrl: './intro-stepper.component.html',
})

export class IntroStepperComponent {
  private dialogRef = inject(MatDialogRef<IntroStepperComponent>);
  private introService = inject(IntroService);

  finish() {
    this.introService.setViewedIntro();
    this.dialogRef.close();
  }
}
