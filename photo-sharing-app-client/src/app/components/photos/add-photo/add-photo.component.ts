import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PhotosService } from 'src/app/services/photos.service';

@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.scss'],
})
export class AddPhotoComponent {
  addPhotoForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    image: new FormControl(null, Validators.required),
  });
  selectedImage: any;
  @Output() updateImageDataEvent = new EventEmitter<string>();

  constructor(
    private photoService: PhotosService,
    private toastr: ToastrService
  ) {}

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedImage = file;
  }

  ngOnInit() {
    this.addPhotoForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      image: new FormControl(null, Validators.required),
    });
  }

  resetForm(): void {
    this.addPhotoForm.reset();
  }

  addPhoto() {
    if (this.addPhotoForm.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append('title', this.addPhotoForm.get('title')?.value);
    formData.append('description', this.addPhotoForm.get('description')?.value);
    formData.append('image', this.selectedImage);

    this.photoService.addPhoto(formData).subscribe({
      next: (response: any) => {
        this.resetForm();
        if (response.code) {
          this.toastr.success(response.message, '', { closeButton: true });
          this.updateImageDataEvent.emit(response);
        } 
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
