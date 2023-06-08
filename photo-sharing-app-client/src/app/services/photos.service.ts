import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  private API_URL = environment.apiURL;
  isProfileEnabledSubject = new BehaviorSubject<any>(false);

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
  }

  getAllUserPhotos(): Observable<any> {
    return this.http.get(`${this.API_URL}getAllUserPhotos`);
  }

  getUserPhotos(): Observable<any> {
    return this.http.get(`${this.API_URL}getUserPhotos`);
  }

  addPhoto(photoData: any) {
    return this.http.post(`${this.API_URL}addPhoto`, photoData);
  }

  deletePhoto(photoId: string) {
    return this.http.delete(`${this.API_URL}deletePhoto/${photoId}`);
  }

  deletePhotos(photoData: any) {
    return this.http.post(`${this.API_URL}deletePhotos`, photoData);
  }
}
