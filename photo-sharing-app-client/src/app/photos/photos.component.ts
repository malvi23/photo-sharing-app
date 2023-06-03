import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
} from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { PhotosService } from '../services/photos.service';
import { Observable, map } from 'rxjs';

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
  allPhotos: any;
  // allPhotos$: Observable<any[]> | undefined;

  constructor(
    private photosService: PhotosService,
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router, // private formBuilder: FormBuilder
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getPhotos();
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
      next: (photosRes: any) => {
        if (photosRes.code) {
          this.allPhotos = photosRes.data.map((image: any) => ({
            ...image,
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
            this.allPhotos = this.allPhotos.filter(
              (photo: any) => photo.id !== photoId
            );
          }else{
            //todo:display error
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
