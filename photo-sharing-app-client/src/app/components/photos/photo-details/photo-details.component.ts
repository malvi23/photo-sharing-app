import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { saveAs } from 'file-saver';
import Tooltip from 'bootstrap/js/dist/tooltip';

@Component({
  selector: 'app-photo-details',
  templateUrl: './photo-details.component.html',
  styleUrls: ['./photo-details.component.scss'],
})
export class PhotoDetailsComponent {
  photoData: any;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(){
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(tooltipTriggerEl => {
      return new Tooltip(tooltipTriggerEl);
    });
  }
  
  downloadPhoto() {
    saveAs(this.photoData.blobImage, this.photoData.title);
  }
}
