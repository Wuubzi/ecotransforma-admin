// voluntarios.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { TitleCasePipe, CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Aside } from '../../components/aside/aside';
import { VoluntariosService, Voluntario } from '../../services/voluntarios';

@Component({
  selector: 'app-voluntarios',
  templateUrl: './volunteers.html',
  imports: [TitleCasePipe, CommonModule, Aside],
})
export class Volunteers implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private voluntariosService = inject(VoluntariosService);

  isLoading = false;
  error: string | null = null;
  voluntarios: Voluntario[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadVoluntarios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga todos los voluntarios
   */
  loadVoluntarios(): void {
    this.isLoading = true;
    this.error = null;

    this.voluntariosService
      .getVoluntarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (voluntarios) => {
          this.voluntarios = voluntarios;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading voluntarios:', error);
          this.error = 'Error al cargar los voluntarios';
          this.isLoading = false;
        },
      });
  }

  /**
   * Aprueba un voluntario
   */
  aprobarVoluntario(voluntario: Voluntario): void {
    this.voluntariosService
      .aprobarVoluntario(voluntario.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedVoluntario) => {
          const index = this.voluntarios.findIndex((v) => v.id === voluntario.id);
          if (index !== -1) {
            this.voluntarios[index] = updatedVoluntario;
          }
        },
        error: (error) => {
          console.error('Error approving voluntario:', error);
          // Update locally as fallback
          voluntario.estado = 'aprobado';
        },
      });
  }

  /**
   * Rechaza un voluntario
   */
  rechazarVoluntario(voluntario: Voluntario): void {
    if (confirm('¿Estás seguro de que quieres rechazar este voluntario?')) {
      this.voluntariosService
        .rechazarVoluntario(voluntario.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedVoluntario) => {
            const index = this.voluntarios.findIndex((v) => v.id === voluntario.id);
            if (index !== -1) {
              this.voluntarios[index] = updatedVoluntario;
            }
          },
          error: (error) => {
            console.error('Error rejecting voluntario:', error);
            // Update locally as fallback
            voluntario.estado = 'rechazado';
          },
        });
    }
  }

  /**
   * Activa un voluntario
   */
  activarVoluntario(voluntario: Voluntario): void {
    this.voluntariosService
      .activarVoluntario(voluntario.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedVoluntario) => {
          const index = this.voluntarios.findIndex((v) => v.id === voluntario.id);
          if (index !== -1) {
            this.voluntarios[index] = updatedVoluntario;
          }
        },
        error: (error) => {
          console.error('Error activating voluntario:', error);
          // Update locally as fallback
          voluntario.estado = 'activo';
        },
      });
  }

  /**
   * Desactiva un voluntario
   */
  desactivarVoluntario(voluntario: Voluntario): void {
    this.voluntariosService
      .desactivarVoluntario(voluntario.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedVoluntario) => {
          const index = this.voluntarios.findIndex((v) => v.id === voluntario.id);
          if (index !== -1) {
            this.voluntarios[index] = updatedVoluntario;
          }
        },
        error: (error) => {
          console.error('Error deactivating voluntario:', error);
          // Update locally as fallback
          voluntario.estado = 'inactivo';
        },
      });
  }

  /**
   * Obtiene el color del badge según el estado
   */
  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprobado':
        return 'bg-green-100 text-green-800';
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      case 'activo':
        return 'bg-blue-100 text-blue-800';
      case 'inactivo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Ver perfil de un voluntario
   */
  verPerfil(voluntario: Voluntario): void {
    console.log('Ver perfil de voluntario:', voluntario);
    // Aquí se puede abrir un modal o navegar a una página de detalle
  }

  /**
   * Obtiene las iniciales de un nombre
   */
  getInitials(nombre: string): string {
    return nombre
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
