import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  
  @Input() allPhotos: any[] = [];
  @Input() selectedPhotos: any[] = [];
  @Input() isSelectionEnabled:boolean = false;
  @Input() actionBtn:string = 'Select';
  @Output() deletePhotosEvent = new EventEmitter<string>();
  @Output() selectActionEvent = new EventEmitter<string>();
  //todo:handle add photo modal open event

  constructor(private userService: UserService) {}

  ngOnInit() {
    console.log('allPhotos: ', this.allPhotos);
    console.log('selectedPhotos: ', this.selectedPhotos);
  }

  clearSelection() {
    this.allPhotos.map((photos: any) => {
      photos.checked = false;
      return photos;
    });
    this.selectedPhotos = [];
  }

  selectActionClicked() {
    this.selectActionEvent.emit();
  }

  deletePhotos() {
    console.log('allPhotos: ', this.allPhotos);
    console.log('this.selectedPhotos:', this.selectedPhotos);
    this.deletePhotosEvent.emit(); //todo: handle this event
  }

  logout(): void {
    this.userService.logout();
  }
}
