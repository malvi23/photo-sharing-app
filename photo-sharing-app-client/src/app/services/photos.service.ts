import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  private API_URL = environment.apiURL;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  getUserPhotos(): Observable<any> {
    return this.http.get(`${this.API_URL}getUserPhotos`);
  }

  addPhoto(photoData: any) {
    return this.http.post(`${this.API_URL}addPhoto`, photoData);
  }

  deletePhoto(photoId: string) {
    return this.http.delete(`${this.API_URL}deletePhoto/${photoId}`);
  }
}
