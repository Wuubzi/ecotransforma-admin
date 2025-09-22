import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Actividad {
  id: number;
  request_name: string;
  place_type: string;
  place_name: string;
  request_contact: string;
  request_email: string;
  request_address: string;
  activity_types: string;
  fechaRegistro: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'activo' | 'completado';
}

export interface CreateActividadRequest {
  request_name: string;
  place_type: string;
  place_name: string;
  request_contact: string;
  request_email: string;
  request_address: string;
  activity_types: string;
}

export interface UpdateActividadRequest {
  id: number;
  request_name?: string;
  place_type?: string;
  place_name?: string;
  request_contact?: string;
  request_email?: string;
  request_address?: string;
  activity_types?: string;
  estado?: 'pendiente' | 'aprobado' | 'rechazado' | 'activo' | 'completado';
}

@Injectable({ providedIn: 'root' })
export class ActividadesService {
  private apiUrl = 'http://localhost:3000/landing';
  private http = inject(HttpClient);

  /**
   * Obtiene todas las actividades
   */
  getActividades(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`http://localhost:3000/landing/actividades`);
  }

  /**
   * Obtiene actividades por estado
   */
  getActividadesByEstado(estado: string): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.apiUrl}/actividades?estado=${estado}`);
  }

  /**
   * Obtiene una actividad por ID
   */
  getActividad(id: number): Observable<Actividad> {
    return this.http.get<Actividad>(`${this.apiUrl}/actividades/${id}`);
  }

  /**
   * Crea una nueva actividad
   */
  createActividad(data: CreateActividadRequest): Observable<Actividad> {
    return this.http.post<Actividad>(`${this.apiUrl}/actividades`, data);
  }

  /**
   * Actualiza una actividad existente
   */
  updateActividad(data: UpdateActividadRequest): Observable<Actividad> {
    return this.http.put<Actividad>(`${this.apiUrl}/actividades/${data.id}`, data);
  }

  /**
   * Elimina una actividad
   */
  deleteActividad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/actividades/${id}`);
  }

  /**
   * Cambia el estado de una actividad
   */
  changeActividadStatus(
    id: number,
    estado: 'pendiente' | 'aprobado' | 'rechazado' | 'activo' | 'completado'
  ): Observable<Actividad> {
    return this.http.patch<Actividad>(`${this.apiUrl}/actividades/${id}/status`, { estado });
  }

  /**
   * Busca actividades por nombre del solicitante o lugar
   */
  searchActividades(query: string): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(
      `${this.apiUrl}/actividades/search?q=${encodeURIComponent(query)}`
    );
  }

  /**
   * Obtiene actividades por tipo de lugar
   */
  getActividadesByPlaceType(placeType: string): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.apiUrl}/actividades/place-type/${placeType}`);
  }

  /**
   * Obtiene actividades por tipo de actividad
   */
  getActividadesByActivityType(activityType: string): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(
      `${this.apiUrl}/actividades/activity-type/${encodeURIComponent(activityType)}`
    );
  }

  /**
   * Obtiene estadísticas de actividades
   */
  getActividadesStats(): Observable<{
    totalActividades: number;
    pendientes: number;
    aprobadas: number;
    activas: number;
    completadas: number;
    rechazadas: number;
    newActividadesThisMonth: number;
  }> {
    return this.http.get<{
      totalActividades: number;
      pendientes: number;
      aprobadas: number;
      activas: number;
      completadas: number;
      rechazadas: number;
      newActividadesThisMonth: number;
    }>(`${this.apiUrl}/actividades/stats`);
  }

  /**
   * Aprueba una actividad
   */
  aprobarActividad(id: number): Observable<Actividad> {
    return this.changeActividadStatus(id, 'aprobado');
  }

  /**
   * Rechaza una actividad
   */
  rechazarActividad(id: number): Observable<Actividad> {
    return this.changeActividadStatus(id, 'rechazado');
  }

  /**
   * Activa una actividad
   */
  activarActividad(id: number): Observable<Actividad> {
    return this.changeActividadStatus(id, 'activo');
  }

  /**
   * Completa una actividad
   */
  completarActividad(id: number): Observable<Actividad> {
    return this.changeActividadStatus(id, 'completado');
  }
}
