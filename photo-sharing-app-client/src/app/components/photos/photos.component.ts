import { Component } from '@angular/core';
import { PhotosService } from '../../services/photos.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../services/spinner.service';
import { LoggedInUserReq } from '../../interfaces/photos-interface';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { PhotoDetailsComponent } from './photo-details/photo-details.component';
import Tooltip from 'bootstrap/js/dist/tooltip';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent {
  allPhotos: any = [];
  // allPhotos$: Observable<any[]> | undefined;
  isSpinnerVisible: boolean = false;
  actionBtn: string = 'Select';
  isSelectionEnabled: boolean = false;
  selectedPhotos: any[] = [];
  modalRef?: BsModalRef;
  isProfileEnabled: boolean = false;
  allSubscription: any = [];

  constructor(
    public photosService: PhotosService,
    private toastr: ToastrService,
    public spinnerService: SpinnerService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => {
      return new Tooltip(tooltipTriggerEl);
    });

    this.allSubscription.push(
      this.photosService.isProfileEnabledSubject.subscribe(
        (isEnabled: boolean) => {
          this.isProfileEnabled = isEnabled;
          this.isProfileEnabled ? this.getPhotos() : this.getAllUserPhotos();
        }
      )
    );
  }

  ngOnDestroy() {
    this.allSubscription.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  openPhotoDetailsModal(photo: any) {
    const initialState: ModalOptions = {
      initialState: {
        size: 'lg',
        photoData: photo,
      },
    };
    this.modalRef = this.modalService.show(PhotoDetailsComponent, initialState);
  }

  clearSelection() {
    this.allPhotos.map((photos: any) => {
      photos.checked = false;
      return photos;
    });
    this.selectedPhotos = [];
  }

  selectActionClicked() {
    this.actionBtn = !this.isSelectionEnabled ? 'Cancel' : 'Select';
    this.isSelectionEnabled = !this.isSelectionEnabled;
    this.clearSelection();
  }

  onPhotoDivClick(photo: any) {
    photo.checked = !photo.checked;
    this.onphotoSelect(photo);
  }

  onphotoSelect(photo: any) {
    if (photo.checked) {
      this.selectedPhotos.push(photo.id);
    } else {
      const index = this.selectedPhotos.findIndex(
        (selectedPhoto) => selectedPhoto === photo.id
      );
      if (index !== -1) {
        this.selectedPhotos.splice(index, 1);
      }
    }
  }

  base64toBlob(base64: string, type: string): Blob {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type });
  }

  getBlobUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  allPhotosResManipulation(photosRes: LoggedInUserReq) {
    if (photosRes.code) {
      this.allPhotos = photosRes.data.map((image: any) => ({
        ...image,
        selected: false,
        blobImage: URL.createObjectURL(
          this.base64toBlob(image.base64Image, 'image/jpeg')
        ),
      }));
    }
  }

  getAllUserPhotos() {
    this.photosService.getAllUserPhotos().subscribe({
      next: (photosRes: LoggedInUserReq) => {
        this.allPhotosResManipulation(photosRes);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  getPhotos() {
    this.photosService.getUserPhotos().subscribe({
      next: (photosRes: LoggedInUserReq) => {
        this.allPhotosResManipulation(photosRes);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  deletePhotos() {
    if (this.selectedPhotos.length == 0) {
      this.toastr.warning('Please select any photo(s)', '', {
        closeButton: true,
      });
      return;
    }
    if (confirm('Are you sure you want to delete selected photo(s) ?')) {
      this.photosService
        .deletePhotos({ imageIds: this.selectedPhotos })
        .subscribe({
          next: (response: any) => {
            if (response.code) {
              this.toastr.success(response.message, '', { closeButton: true });
              this.allPhotos = this.allPhotos.filter((photo: any) => {
                return !this.selectedPhotos.includes(photo.id);
              });
              this.selectActionClicked();
            }
          },
          error: (e) => {
            console.log(e);
          },
        });
    }
  }

  downloadPhotos() {
    if (this.selectedPhotos.length > 0) {
      let selectedImages = this.allPhotos
        .filter((photo: any) => {
          return this.selectedPhotos.includes(photo.id);
        })
        .map(
          (photo: any) =>
            (photo = { blobImage: photo.blobImage, title: photo.title })
        );
      selectedImages.forEach((image: { blobImage: Blob; title: string }) => {
        saveAs(image.blobImage, image.title);
      });
      this.toastr.success('Photos downloaded successfully !', '', {
        closeButton: true,
      });
      this.selectActionClicked();
    } else {
      this.toastr.warning('Please select photo(s)', '', {
        closeButton: true,
      });
    }
  }
}
