// aside.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-aside',
  imports: [CommonModule, RouterModule],
  templateUrl: './aside.html',
})
export class Aside {
  menuItems = [
    {
      route: '/add-points',
      icon: 'fas fa-recycle',
      label: 'Añadir Puntos',
    },
    {
      route: '/ofertas',
      icon: 'fas fa-recycle',
      label: 'Ofertas',
    },
    {
      route: '/recolections',
      icon: 'fas fa-truck',
      label: 'Recolecciones',
    },
    {
      route: '/volunteers',
      icon: 'fas fa-users',
      label: 'Voluntarios',
    },
    {
      route: '/actividades',
      icon: 'fas fa-users',
      label: 'Actividades',
    },
  ];

  logout() {
    // Lógica de cerrar sesión
    console.log('Cerrando sesión...');
  }
}
