import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { TooltipService } from 'src/app/services/tooltip.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Input() allPhotos: any[] = [];
  @Input() selectedPhotos: any[] = [];
  @Input() isSelectionEnabled: boolean = false;
  @Input() actionBtn: string = 'Select';
  @Output() deletePhotosEvent = new EventEmitter<string>();
  @Output() downloadPhotosEvent = new EventEmitter<string>();
  @Output() selectActionEvent = new EventEmitter<string>();
  @ViewChild('logoutTooltipElement') logoutTooltipElement!: ElementRef;
  currentUserName: any = '';
  //todo:handle add photo modal open event

  constructor(
    private userService: UserService,
    private tooltipService: TooltipService
  ) {}

  ngOnInit(){
    this.currentUserName = this.userService.getCurrentUser().name
  }

  ngOnDestroy() {
    this.tooltipService.hideTooltips();
  }

  showTooltip(logoutTooltipElement: HTMLElement) {
    this.tooltipService.showTooltip(logoutTooltipElement);
  }

  // clearSelection() {
  //   this.allPhotos.map((photos: any) => {
  //     photos.checked = false;
  //     return photos;
  //   });
  //   this.selectedPhotos = [];
  // }

  selectActionClicked() {
    this.selectActionEvent.emit();
  }

  deletePhotos() {
    this.deletePhotosEvent.emit();
  }

  downloadPhotos() {
    this.downloadPhotosEvent.emit();
  }

  logout(): void {
    this.userService.logout();
  }
}
