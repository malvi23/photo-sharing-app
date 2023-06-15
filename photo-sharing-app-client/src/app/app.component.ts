import { Component, HostListener } from '@angular/core';
import { SpinnerService } from './services/spinner.service';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'photo-sharing-app-client';
  isSpinnerVisible: boolean = false;
  lastInteractionTime: Date = new Date();
  idleTimeoutMinutes = 15;
  idleTimeoutMilliseconds = this.idleTimeoutMinutes * 60 * 1000;
  isIdle: boolean = false;

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent) {
    this.lastInteractionTime = new Date();
  }
  constructor(public spinnerService: SpinnerService, private tokenService:TokenService) {
    this.startIdleTimer();
  }
  ngOnInit() {
    this.isSpinnerVisible = this.spinnerService.isSpinnerVisible;
  }

  /* This method is to check if user is idle for above mentioned idleTimeoutMinutes */
  startIdleTimer() {
    setInterval(() => {
      const currentTime = new Date();
      const elapsedTime =
        currentTime.getTime() - this.lastInteractionTime.getTime();

      if (elapsedTime >= this.idleTimeoutMilliseconds) {
        this.tokenService.isIdle = true;
      } else {
        this.tokenService.isIdle = false;
      }
    }, 1000); // Check every second
  }
}
