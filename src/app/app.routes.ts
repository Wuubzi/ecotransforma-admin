import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth';
import { alreadyAuthGuard } from './guards/already-auth';
import { Dashboard } from './pages/dashboard/dashboard';
import { AddPoints } from './pages/add-points/add-points';
import { Bussiness } from './pages/bussiness/bussiness';
import { Volunteers } from './pages/volunteers/volunteers';
import { Recolecciones } from './pages/recolections/recolections';
import { Ofertas } from './pages/ofertas/ofertas';
import { Actividades } from './pages/actividades/actividades';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: Login,
    canActivate: [alreadyAuthGuard],
  },
  {
    path: 'add-points',
    component: AddPoints,
    canActivate: [authGuard],
  },
  {
    path: 'actividades',
    component: Actividades,
    canActivate: [authGuard],
  },
  {
    path: 'ofertas',
    component: Ofertas,
    canActivate: [authGuard],
  },
  {
    path: 'recolections',
    component: Recolecciones,
    canActivate: [authGuard],
  },
  {
    path: 'bussiness',
    component: Bussiness,
    canActivate: [authGuard],
  },
  {
    path: 'volunteers',
    component: Volunteers,
    canActivate: [authGuard],
  },
  {
    path: 'volunteers',
    component: Volunteers,
    canActivate: [authGuard],
  },
];
