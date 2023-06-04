import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotosRoutingModule } from './photos-routing.module';
import { PhotosComponent } from './photos.component';
import { AddPhotoComponent } from './add-photo/add-photo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgxBootstrapModule } from 'src/app/commons/ngx-bootstrap/ngx-bootstrap.module';

@NgModule({
  declarations: [
    PhotosComponent,
    AddPhotoComponent
  ],
  imports: [
    CommonModule,
    PhotosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxBootstrapModule
  ]
})
export class PhotosModule { }