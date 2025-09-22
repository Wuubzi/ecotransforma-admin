import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Aside } from '../../components/aside/aside';
import { ActividadesService, Actividad } from '../../services/actividades';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.html',
  imports: [CommonModule, Aside],
})
export class Actividades implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private actividadesService = inject(ActividadesService);

  isLoading = false;
  error: string | null = null;
  actividades: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadActividades();
    this.loadActividades();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga todas las actividades
   */
  loadActividades(): void {
    this.isLoading = true;
    this.error = null;

    this.actividadesService
      .getActividades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (actividades) => {
          console.log(actividades);
          this.actividades = actividades;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading actividades:', error);
          this.error = 'Error al cargar las actividades';
          this.isLoading = false;
          // Fallback to mock data in case of error
          this.loadMockData();
        },
      });
  }

  /**
   * Carga datos de prueba en caso de error del servidor
   */
  private loadMockData(): void {
    this.actividades = [
      {
        id: 1,
        request_name: 'Carlos Andres Salas Correa',
        place_type: 'Barrio',
        place_name: 'Villa Estadio',
        request_contact: '3106931114',
        request_email: 'carlosasalas321@gmail.com',
        request_address: 'carrera 16b 68D-63',
        activity_types: 'Capacitaciones lúdicas y talleres',
        fechaRegistro: '2025-09-08',
        estado: 'pendiente',
      },
      {
        id: 2,
        request_name: 'María Elena Rodríguez',
        place_type: 'Colegio',
        place_name: 'IED San José',
        request_contact: '3201234567',
        request_email: 'maria.rodriguez@colegio.edu.co',
        request_address: 'Calle 80 #15-20',
        activity_types: 'Charlas ambientales',
        fechaRegistro: '2025-09-05',
        estado: 'aprobado',
      },
      {
        id: 3,
        request_name: 'Juan Carlos Pérez',
        place_type: 'Empresa',
        place_name: 'EcoSoluciones SAS',
        request_contact: '3157890123',
        request_email: 'juan.perez@ecosoluciones.com',
        request_address: 'Carrera 50 #45-30',
        activity_types: 'Talleres de reciclaje corporativo',
        fechaRegistro: '2025-09-03',
        estado: 'activo',
      },
    ];
  }

  /**
   * Aprueba una actividad
   */
  aprobarActividad(actividad: Actividad): void {
    this.actividadesService
      .aprobarActividad(actividad.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedActividad) => {
          const index = this.actividades.findIndex((a) => a.id === actividad.id);
          if (index !== -1) {
            this.actividades[index] = updatedActividad;
          }
        },
        error: (error) => {
          console.error('Error approving actividad:', error);
          // Update locally as fallback
          actividad.estado = 'aprobado';
        },
      });
  }

  /**
   * Rechaza una actividad
   */
  rechazarActividad(actividad: Actividad): void {
    if (confirm('¿Estás seguro de que quieres rechazar esta actividad?')) {
      this.actividadesService
        .rechazarActividad(actividad.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedActividad) => {
            const index = this.actividades.findIndex((a) => a.id === actividad.id);
            if (index !== -1) {
              this.actividades[index] = updatedActividad;
            }
          },
          error: (error) => {
            console.error('Error rejecting actividad:', error);
            // Update locally as fallback
            actividad.estado = 'rechazado';
          },
        });
    }
  }

  /**
   * Activa una actividad
   */
  activarActividad(actividad: Actividad): void {
    this.actividadesService
      .activarActividad(actividad.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedActividad) => {
          const index = this.actividades.findIndex((a) => a.id === actividad.id);
          if (index !== -1) {
            this.actividades[index] = updatedActividad;
          }
        },
        error: (error) => {
          console.error('Error activating actividad:', error);
          // Update locally as fallback
          actividad.estado = 'activo';
        },
      });
  }

  /**
   * Completa una actividad
   */
  completarActividad(actividad: Actividad): void {
    this.actividadesService
      .completarActividad(actividad.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedActividad) => {
          const index = this.actividades.findIndex((a) => a.id === actividad.id);
          if (index !== -1) {
            this.actividades[index] = updatedActividad;
          }
        },
        error: (error) => {
          console.error('Error completing actividad:', error);
          // Update locally as fallback
          actividad.estado = 'completado';
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
      case 'completado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Obtiene el color del badge según el tipo de lugar
   */
  getPlaceTypeColor(placeType: string): string {
    switch (placeType.toLowerCase()) {
      case 'barrio':
        return 'bg-purple-100 text-purple-800';
      case 'colegio':
        return 'bg-indigo-100 text-indigo-800';
      case 'empresa':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
