import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotosRoutingModule } from './photos-routing.module';
import { PhotosComponent } from './photos.component';
import { AddPhotoComponent } from './add-photo/add-photo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgxBootstrapModule } from 'src/app/commons/ngx-bootstrap/ngx-bootstrap.module';
import { NavbarComponent } from './navbar/navbar.component';
import { PhotoDetailsComponent } from './photo-details/photo-details.component';

@NgModule({
  declarations: [
    PhotosComponent,
    AddPhotoComponent,
    NavbarComponent,
    PhotoDetailsComponent
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
