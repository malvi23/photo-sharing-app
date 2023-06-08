import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { UserService } from '../../services/user.service';
import { PhotosService } from '../../services/photos.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { saveAs } from 'file-saver';

import { PhotosComponent } from './photos.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddPhotoComponent } from './add-photo/add-photo.component';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

fdescribe('PhotosComponent', () => {
  let component: PhotosComponent;
  let fixture: ComponentFixture<PhotosComponent>;
  let mockUserService: any;
  let mockPhotosService: any;
  let mockToastrService: any;
  let mockBsModalService: any;
  let mockPhotosServiceSpy: any;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', [
      'logout',
      'getCurrentUser',
    ]);
    mockPhotosService = jasmine.createSpyObj('PhotosService', [
      'getUserPhotos',
      'deletePhotos',
    ]);
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'warning',
    ]);
    // mockSpinnerService = jasmine.createSpyObj('SpinnerService', ['']);
    mockBsModalService = jasmine.createSpyObj('BsModalService', ['show']);

    await TestBed.configureTestingModule({
      declarations: [PhotosComponent, NavbarComponent, AddPhotoComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: PhotosService, useValue: mockPhotosService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: BsModalService, useValue: mockBsModalService },
      ],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosComponent);
    component = fixture.componentInstance;

    // Set initial values
    component.allPhotos = [];
    component.isSpinnerVisible = false;
    component.actionBtn = 'Select';
    component.isSelectionEnabled = false;
    component.selectedPhotos = [];
    component.spinnerService.isSpinnerVisible = false;

    // Creating spy object
    mockPhotosServiceSpy = mockPhotosService.getUserPhotos.and.returnValue(
      of({
        code: 1,
        status: 'success',
        message: 'Photos fetched successfully!',
        data: [
          {
            id: '647ff22b0f71bcf23f34f4d4',
            title: 'testestest',
            description: 'C:\\fakepath\\Testetest (1).jpg',
            base64Image: 'testImage',
          },
        ],
      })
    );
    mockUserService.getCurrentUser.and.returnValue({
      name: 'Test User',
    });

    fixture.detectChanges();
  });

  it('should create and fetch all user photos', () => {
    expect(component).toBeTruthy();
    expect(mockPhotosServiceSpy).toHaveBeenCalled();
    // expect(component.allPhotos.length).toEqual(1);
  });

  it('should delete selected photos', fakeAsync(() => {
    const selectActionClickedSpy = spyOn(component, 'selectActionClicked');

    const confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
    component.selectedPhotos = ['12345', '67890'];

    // Creating spy objects
    const mockPhotosServiceSpy = mockPhotosService.deletePhotos.and.returnValue(
      of({ code: 1, status: 'success', message: 'Successfully deleted !' })
    );
    component.deletePhotos();
    tick();
    expect(confirmSpy).toHaveBeenCalledWith(
      'Are you sure you want to delete selected photo(s) ?'
    );
    expect(mockPhotosServiceSpy).toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalled();
    expect(selectActionClickedSpy).toHaveBeenCalled();
  }));

  it('should call download', fakeAsync(() => {
    const selectActionClickedSpy = spyOn(component, 'selectActionClicked');
    spyOn(saveAs, 'saveAs');
    component.allPhotos = [
      {
        id: '12345',
        title: 'Photo1',
        description: 'Photo1 uploaded',
        checked: true,
        blobImage: 'dummy_image',
      },
      {
        id: '54643',
        title: 'Photo2',
        description: 'Photo2 uploaded',
        checked: false,
        blobImage: 'dummy_image',
      },
      {
        id: '67890',
        title: 'Photo3',
        description: 'Photo3 uploaded',
        checked: true,
        blobImage: 'dummy_image',
      },
    ];
    component.selectedPhotos = ['12345', '67890'];
    component.downloadPhotos();
    expect(mockToastrService.success).toHaveBeenCalled();
    expect(selectActionClickedSpy).toHaveBeenCalled();
  }));

  it('should clear the photos selection', () => {
    component.allPhotos = [
      { title: 'Photo1', description: 'Photo1 uploaded', checked: true },
      { title: 'Photo2', description: 'Photo2 uploaded', checked: false },
      { title: 'Photo3', description: 'Photo3 uploaded', checked: true },
    ];
    component.clearSelection();
    component.allPhotos.forEach((photo: any) => {
      expect(photo.checked).toBeFalse();
    });
    expect(component.selectedPhotos.length).toEqual(0);
  });

  it('should clear the selection on select button click', () => {
    const clearSelectionSpy = spyOn(component, 'clearSelection');
    component.isSelectionEnabled = false;
    component.selectActionClicked();
    expect(clearSelectionSpy).toHaveBeenCalled();
  });

  it('should add photo to selectedPhotos if photo is selected', () => {
    let photo = {
      id: '12345',
      checked: false,
    };
    component.selectedPhotos = [];
    component.onPhotoDivClick(photo);
    expect(component.selectedPhotos.length).toEqual(1);
  });

  it('should remove photo from selectedPhotos if user removes the selection', () => {
    let photo = {
      id: '12345',
      checked: true,
    };
    component.selectedPhotos = ['12345'];
    component.onPhotoDivClick(photo);
    expect(component.selectedPhotos.length).toEqual(0);
  });

  it('should convert base64 image string to Blob', () => {
    const base64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    const expectedBlob = new Blob(
      [Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))],
      { type: 'image/png' }
    );
    let type = 'image/jpeg';
    const result = component.base64toBlob(base64, type);
    expect(result).toEqual(expectedBlob);
  });
});
