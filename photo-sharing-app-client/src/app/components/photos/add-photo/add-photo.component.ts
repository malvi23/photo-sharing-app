import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
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
  // @ViewChild('fileInput') fileInputElement!: ElementRef<HTMLInputElement>;

  constructor(
    private photoService: PhotosService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.addPhotoForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      image: new FormControl(null, Validators.required),
    });
  }

  // setFileInputValue(file: File) {
  //   this.fileInputElement.nativeElement.value = 'C:\fakepath\retert.jpg';
  //   this.selectedImage = file;
  // }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedImage = file;
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
