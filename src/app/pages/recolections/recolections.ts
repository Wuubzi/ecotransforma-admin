// recolecciones.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Aside } from '../../components/aside/aside';
import { RecoleccionesService, Recoleccion } from '../../services/recolecciones';

@Component({
  selector: 'app-recolecciones',
  templateUrl: './recolections.html',
  imports: [CommonModule, Aside],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Recolecciones implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private recoleccionesService = inject(RecoleccionesService);

  isLoading = false;
  error: string | null = null;
  recolecciones: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadRecolecciones();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga todas las recolecciones
   */
  loadRecolecciones(): void {
    this.isLoading = true;
    this.error = null;

    this.recoleccionesService
      .getRecolecciones()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (recolecciones) => {
          console.log(recolecciones);
          this.recolecciones = recolecciones;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading recolecciones:', error);
          this.error = 'Error al cargar las recolecciones';
          this.isLoading = false;
        },
      });
  }

  /**
   * Inicia una recolección
   */
  iniciarRecoleccion(recoleccion: Recoleccion): void {
    this.recoleccionesService
      .iniciarRecoleccion(recoleccion.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedRecoleccion) => {
          const index = this.recolecciones.findIndex((r) => r.id === recoleccion.id);
          if (index !== -1) {
            this.recolecciones[index] = updatedRecoleccion;
          }
        },
        error: (error) => {
          console.error('Error starting recoleccion:', error);
          // Update locally as fallback
          recoleccion.estado = 'en-proceso';
        },
      });
  }

  /**
   * Completa una recolección
   */
  completarRecoleccion(recoleccion: Recoleccion): void {
    this.recoleccionesService
      .completarRecoleccion(recoleccion.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedRecoleccion) => {
          const index = this.recolecciones.findIndex((r) => r.id === recoleccion.id);
          if (index !== -1) {
            this.recolecciones[index] = updatedRecoleccion;
          }
        },
        error: (error) => {
          console.error('Error completing recoleccion:', error);
          // Update locally as fallback
          recoleccion.estado = 'completada';
        },
      });
  }

  /**
   * Cancela una recolección
   */
  cancelarRecoleccion(recoleccion: Recoleccion): void {
    if (confirm('¿Estás seguro de que quieres cancelar esta recolección?')) {
      this.recoleccionesService
        .cancelarRecoleccion(recoleccion.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedRecoleccion) => {
            const index = this.recolecciones.findIndex((r) => r.id === recoleccion.id);
            if (index !== -1) {
              this.recolecciones[index] = updatedRecoleccion;
            }
          },
          error: (error) => {
            console.error('Error canceling recoleccion:', error);
            // Update locally as fallback
            recoleccion.estado = 'cancelada';
          },
        });
    }
  }

  /**
   * Obtiene el color del badge según el estado
   */
  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'programada':
        return 'bg-blue-100 text-blue-800';
      case 'en-proceso':
        return 'bg-yellow-100 text-yellow-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Ver detalle de una recolección
   */
  verDetalle(recoleccion: Recoleccion): void {
    console.log('Ver detalle de recolección:', recoleccion);
    // Aquí se puede abrir un modal o navegar a una página de detalle
  }

  /**
   * Editar una recolección
   */
  editarRecoleccion(recoleccion: Recoleccion): void {
    console.log('Editar recolección:', recoleccion);
    // Aquí se puede abrir un modal de edición
  }
}
