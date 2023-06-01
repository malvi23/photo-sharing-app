import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'photos',
    loadChildren: () => import('./photos/photos.module').then(m => m.PhotosModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
