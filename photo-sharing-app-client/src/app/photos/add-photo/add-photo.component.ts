import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(private photoService: PhotosService) {}

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedImage = file;
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
        if(response.code){
          this.updateImageDataEvent.emit(response)
        }else{
          // todo: display error
        }
      },
      error: (error) => {
        console.error(error);
        //todo: handle error using http interceptor
      },
    });
  }
}
