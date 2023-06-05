import { Component } from '@angular/core';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'photo-sharing-app-client';
  isSpinnerVisible: boolean =false;
  
  constructor(public spinnerService: SpinnerService){};
  ngOnInit(){
    this.isSpinnerVisible = this.spinnerService.isSpinnerVisible
  }
}
