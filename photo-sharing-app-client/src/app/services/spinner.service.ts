import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  isSpinnerVisible: boolean = false;
  constructor() {}

  showSpinner() {
    this.isSpinnerVisible = true;
  }

  hideSpinner() {
    this.isSpinnerVisible = false;
  }
}
