import { Routes } from '@angular/router'
import { authGuard } from '../app/core/guard/auth.guard'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../app/pages/login/login.page.component').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page.component').then(m => m.RegisterPage)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/home/home.page.component').then(m => m.HomePage)
  },
  {
    path: 'draw',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/draw/draw.page.component').then(m => m.DrawPageComponent)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
]
