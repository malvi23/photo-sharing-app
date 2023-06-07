import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PhotoDetailsComponent } from './photo-details.component';

fdescribe('PhotoDetailsComponent', () => {
  let component: PhotoDetailsComponent;
  let fixture: ComponentFixture<PhotoDetailsComponent>;
  let bsModalRefStub: Partial<BsModalRef>;

  beforeEach(async () => {
    bsModalRefStub = {};
    await TestBed.configureTestingModule({
      declarations: [PhotoDetailsComponent],
      providers: [{ provide: BsModalRef, useValue: bsModalRefStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetailsComponent);
    component = fixture.componentInstance;
    component.photoData = {
      title: 'Test image',
      description: 'Test description',
      blobImage: 'test_url',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
