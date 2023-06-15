import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'photos',
    loadChildren: () =>
      import('./components/photos/photos.module').then((m) => m.PhotosModule),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/photos' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
