import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { PhotosService } from '../../services/photos.service';
import { Observable, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../services/spinner.service';
import { LoggedInUserReq } from '../../interfaces/photos-interface';

export interface Response {
  message: string;
  data: any;
}

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent {
  allPhotos: any = [];
  // allPhotos$: Observable<any[]> | undefined;
  isSpinnerVisible: boolean = false;
  actionBtn:string="Select";
  isSelectionEnabled: boolean = false;
  selectedPhotos: any[] = [] 

  constructor(
    private photosService: PhotosService,
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router, // private formBuilder: FormBuilder
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    public spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.getPhotos();
  }

  selectActionClicked(){
    this.actionBtn = !this.isSelectionEnabled? "Cancel" : "Select"
    this.isSelectionEnabled = !this.isSelectionEnabled
    //clear selection
    this.allPhotos.map((photos:any)=> {
      photos.checked = false
      return photos;
    })
  }

  onPhotoDivClick(photo: any){
    photo.checked = !photo.checked
    this.onphotoSelect(photo)
  }

  onphotoSelect(photo: any) {
    if (photo.checked) {
      this.selectedPhotos.push(photo.id);
    } else {
      const index = this.selectedPhotos.findIndex((selectedPhoto) => selectedPhoto === photo.id);
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

  getPhotos() {
    this.photosService.getUserPhotos().subscribe({
      next: (photosRes: LoggedInUserReq) => {
        if (photosRes.code) {
          this.allPhotos = photosRes.data.map((image: any) => ({
            ...image,
            selected: false,
            blobImage: URL.createObjectURL(
              this.base64toBlob(image.base64Image, 'image/jpeg')
            ),
          }));
        }
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  deletePhoto(photoId: string) {
    if (confirm('Are you sure you want to delete this photo ?')) {
      this.photosService.deletePhoto(photoId).subscribe({
        next: (response: any) => {
          if (response.code) {
            this.toastr.success(response.message, '', { closeButton: true });
            this.allPhotos = this.allPhotos.filter(
              (photo: any) => photo.id !== photoId
            );
          }
        },
        error: (e) => {
          console.log(e);
        },
      });
    }
  }

  deletePhotos() {
    if (confirm('Are you sure you want to delete selected photo(s) ?')) {
      console.log("this.selectedPhotos:",this.selectedPhotos)
      this.photosService.deletePhotos({ imageIds: this.selectedPhotos }).subscribe({
        next: (response: any) => {
          if (response.code) {
            this.selectActionClicked() //To end the select operation
            this.toastr.success(response.message, '', { closeButton: true });
            this.allPhotos = this.allPhotos.filter((photo: any) => {
              return !this.selectedPhotos.includes(photo.id);
            });
          }
        },
        error: (e) => {
          console.log(e);
        },
      });
    }
  }

  logout(): void {
    this.userService.logout();
  }
}
