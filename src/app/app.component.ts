import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IntroStepperComponent } from './components/intro-stepper/intro-stepper.component';
import { IntroService } from './services/intro.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChatPanelComponent } from './components/chat-panel/chat-panel.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    HeaderComponent,
    SidebarComponent,
    ChatPanelComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private dialog = inject(MatDialog);
  private introService = inject(IntroService);

  ngOnInit() {
    if (!this.introService.hasViewedIntro()) {
      this.dialog.open(IntroStepperComponent, {
        maxWidth: '1200px',
        disableClose: true,
      });
    }
  }
}
