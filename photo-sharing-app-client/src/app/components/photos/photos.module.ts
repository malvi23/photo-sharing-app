import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotosRoutingModule } from './photos-routing.module';
import { PhotosComponent } from './photos.component';
import { AddPhotoComponent } from './add-photo/add-photo.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PhotosComponent,
    AddPhotoComponent
  ],
  imports: [
    CommonModule,
    PhotosRoutingModule,
    ReactiveFormsModule
  ]
})
export class PhotosModule { }
