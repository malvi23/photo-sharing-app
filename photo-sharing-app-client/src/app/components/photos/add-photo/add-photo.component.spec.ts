import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { PhotosService } from 'src/app/services/photos.service';

import { AddPhotoComponent } from './add-photo.component';
import { DebugElement, EventEmitter } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

fdescribe('AddPhotoComponent', () => {
  let component: AddPhotoComponent;
  let fixture: ComponentFixture<AddPhotoComponent>;
  let mockToastrService: any;
  let mockPhotosService: any;
  let inputElement: DebugElement;

  beforeEach(async () => {
    mockPhotosService = jasmine.createSpyObj('PhotosService', ['addPhoto']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success']);
    await TestBed.configureTestingModule({
      declarations: [AddPhotoComponent],
      providers: [
        { provide: ToastrService, useValue: mockToastrService },
        { provide: PhotosService, useValue: mockPhotosService },
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPhotoComponent);
    component = fixture.componentInstance;

    // Set initial values
    component.selectedImage = new File(['dummy content'], 'dummy.jpg');
    component.updateImageDataEvent = new EventEmitter<string>();
    inputElement = fixture.debugElement.query(By.css('input[type="file"]'));
    

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign the selected file to the selectedImage property', () => {
    // Arrange
    const file = new File(['dummy content'], 'dummy.jpg');

    // Create a dummy event with a target that contains the file
    const event = {
      target: {
        files: [file],
      },
    };

    // Act
    component.onImageSelected(event);

    // Assert
    expect(component.selectedImage).toEqual(file);
  });

  it('should reset the form', () => {
    component.addPhotoForm.setValue({
      title: 'First Photo',
      description: 'Adding my first photo',
      image: '',
    });
    component.resetForm();
    expect(component.addPhotoForm.untouched).toBe(true);
  });

  // //todo: apend the dummy file to 'image' formControl of addPhotoForm
  // // Error:  InvalidStateError: Failed to set the 'value' property on 'HTMLInputElement': This input element accepts a filename, which may only be programmatically set to the empty string.
  // it('should call toastr message and emit updateImageDataEvent event on successful addition of photo', fakeAsync(() => {
  //   // Arrange
  //   component.addPhotoForm.setValue({
  //     title: 'First Photo',
  //     description: 'Adding my first photo',
  //     image: '',
  //   });
  //   const dummyFile = new File(['dummy-content'], 'dummy-file.png', { type: 'image/png' });
  //   // const event = new Event('change');
  //   // Object.defineProperty(event, 'target', { writable: false, value: { files: [dummyFile] } });
  //   //  const inputElement: HTMLInputElement = fixture.debugElement.query(
  //   //   By.css('input[type="file"]')
  //   // ).nativeElement;
  //   const fileInputElement: HTMLInputElement = fixture.debugElement.query(
  //     By.css('input[type="file"]')
  //   ).nativeElement;
  //   component.fileInputElement = {
  //     nativeElement: fileInputElement,
  //   };

  //   // const formData = new FormData();
  //   // formData.append('image', dummyFile);

  //   let eventEmitted = false;
  //   component.updateImageDataEvent.subscribe(() => {
  //     eventEmitted = true;
  //   });

  //   // Creating spy objects
  //   const mockPhotosServiceSpy = mockPhotosService.addPhoto.and.returnValue(
  //     of({
  //       code: 1,
  //       message: 'Photo added successfully',
  //     })
  //   );

  //   // Act
  //   // inputElement.triggerEventHandler('change', { target: {} });
  //   // inputElement.dispatchEvent(event);
  //   component.setFileInputValue(dummyFile);
  //   console.log("image: ",component.addPhotoForm.get('image')?.value);
  //   console.log("invalid: ",component.addPhotoForm.invalid);
  //   component.addPhoto();
  //   fixture.detectChanges();
  //   tick();
      
      
  //   // Assert
  //   // expect(component.addPhotoForm.get('image')?.value).toBe(dummyFile);
  //   expect(mockPhotosServiceSpy).toHaveBeenCalled();
  //   expect(eventEmitted).toBe(true);
  // }));
});
