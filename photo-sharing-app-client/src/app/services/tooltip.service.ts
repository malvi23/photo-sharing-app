import { Injectable } from '@angular/core';
import Tooltip from 'bootstrap/js/dist/tooltip';

@Injectable({
  providedIn: 'root',
})
export class TooltipService {
  private tooltipEles: HTMLElement[] = [];

  showTooltip(tooltipEle: HTMLElement) {
    this.tooltipEles.push(tooltipEle);
  }

  hideTooltips() {
    this.tooltipEles.forEach((tooltipEle) => {
      let tooltip = Tooltip.getInstance(tooltipEle);
      console.log('tooltip mousout:', tooltip);
      tooltip?.hide()
    });
    this.tooltipEles = [];
  }
}
