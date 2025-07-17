import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IntroStepperComponent } from './components/intro-stepper/intro-stepper.component';
import { IntroService } from './services/intro.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatDialogModule, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private dialog = inject(MatDialog);
  private introService = inject(IntroService);

  ngOnInit() {
    if (!this.introService.hasViewedIntro()) {
      this.dialog.open(IntroStepperComponent, {
        maxWidth: '1200px',
        disableClose: true, // optional: prevents closing without finishing
      });
    }
  }
}
