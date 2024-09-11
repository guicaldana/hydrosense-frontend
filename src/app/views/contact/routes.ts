import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./contact.component').then(m => m.ContactComponent),
    data: {
      title: $localize`Contato`
    }
  }
];


