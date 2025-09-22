import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recoleccion {
  id: number;
  direccion: string;
  fecha: string;
  hora: string;
  name: string;
  email: string;
  tipoMaterial: string;
  estado: 'programada' | 'en-proceso' | 'completada' | 'cancelada';
  voluntariosAsignados: number;
  observaciones?: string;
}

export interface CreateRecoleccionRequest {
  direccion: string;
  fecha: string;
  hora: string;
  nombreContacto: string;
  telefono: string;
  tipoMaterial: string;
  voluntariosAsignados?: number;
  observaciones?: string;
}

export interface UpdateRecoleccionRequest {
  id: number;
  direccion?: string;
  fecha?: string;
  hora?: string;
  nombreContacto?: string;
  telefono?: string;
  tipoMaterial?: string;
  estado?: 'programada' | 'en-proceso' | 'completada' | 'cancelada';
  voluntariosAsignados?: number;
  observaciones?: string;
}

@Injectable({ providedIn: 'root' })
export class RecoleccionesService {
  private apiUrl = 'http://localhost:3000/recolections';
  private http = inject(HttpClient);

  /**
   * Obtiene todas las recolecciones
   */
  getRecolecciones(): Observable<Recoleccion[]> {
    return this.http.get<Recoleccion[]>(`${this.apiUrl}/all`);
  }

  /**
   * Obtiene recolecciones por estado
   */
  getRecoleccionesByEstado(estado: string): Observable<Recoleccion[]> {
    return this.http.get<Recoleccion[]>(`${this.apiUrl}/recolecciones?estado=${estado}`);
  }

  /**
   * Obtiene una recolección por ID
   */
  getRecoleccion(id: number): Observable<Recoleccion> {
    return this.http.get<Recoleccion>(`${this.apiUrl}/recolecciones/${id}`);
  }

  /**
   * Crea una nueva recolección
   */
  createRecoleccion(data: CreateRecoleccionRequest): Observable<Recoleccion> {
    return this.http.post<Recoleccion>(`${this.apiUrl}/recolecciones`, data);
  }

  /**
   * Actualiza una recolección existente
   */
  updateRecoleccion(data: UpdateRecoleccionRequest): Observable<Recoleccion> {
    return this.http.put<Recoleccion>(`${this.apiUrl}/recolecciones/${data.id}`, data);
  }

  /**
   * Elimina una recolección
   */
  deleteRecoleccion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/recolecciones/${id}`);
  }

  /**
   * Cambia el estado de una recolección
   */
  changeRecoleccionStatus(
    id: number,
    estado: 'programada' | 'en-proceso' | 'completada' | 'cancelada'
  ): Observable<Recoleccion> {
    return this.http.patch<Recoleccion>(`${this.apiUrl}/recolecciones/${id}/status`, { estado });
  }

  /**
   * Busca recolecciones por dirección o contacto
   */
  searchRecolecciones(query: string): Observable<Recoleccion[]> {
    return this.http.get<Recoleccion[]>(
      `${this.apiUrl}/recolecciones/search?q=${encodeURIComponent(query)}`
    );
  }

  /**
   * Obtiene recolecciones por tipo de material
   */
  getRecoleccionesByTipoMaterial(tipoMaterial: string): Observable<Recoleccion[]> {
    return this.http.get<Recoleccion[]>(
      `${this.apiUrl}/recolecciones/tipo-material/${encodeURIComponent(tipoMaterial)}`
    );
  }

  /**
   * Obtiene recolecciones por fecha
   */
  getRecoleccionesByFecha(fecha: string): Observable<Recoleccion[]> {
    return this.http.get<Recoleccion[]>(`${this.apiUrl}/recolecciones/fecha/${fecha}`);
  }

  /**
   * Asigna voluntarios a una recolección
   */
  asignarVoluntarios(id: number, voluntariosAsignados: number): Observable<Recoleccion> {
    return this.http.patch<Recoleccion>(`${this.apiUrl}/recolecciones/${id}/voluntarios`, {
      voluntariosAsignados,
    });
  }

  /**
   * Obtiene estadísticas de recolecciones
   */
  getRecoleccionesStats(): Observable<{
    totalRecolecciones: number;
    programadas: number;
    enProceso: number;
    completadas: number;
    canceladas: number;
    newRecoleccionesThisMonth: number;
    materialesTotales: { [key: string]: number };
  }> {
    return this.http.get<{
      totalRecolecciones: number;
      programadas: number;
      enProceso: number;
      completadas: number;
      canceladas: number;
      newRecoleccionesThisMonth: number;
      materialesTotales: { [key: string]: number };
    }>(`${this.apiUrl}/recolecciones/stats`);
  }

  /**
   * Programa una recolección
   */
  programarRecoleccion(id: number): Observable<Recoleccion> {
    return this.changeRecoleccionStatus(id, 'programada');
  }

  /**
   * Inicia una recolección
   */
  iniciarRecoleccion(id: number): Observable<Recoleccion> {
    return this.changeRecoleccionStatus(id, 'en-proceso');
  }

  /**
   * Completa una recolección
   */
  completarRecoleccion(id: number): Observable<Recoleccion> {
    return this.changeRecoleccionStatus(id, 'completada');
  }

  /**
   * Cancela una recolección
   */
  cancelarRecoleccion(id: number): Observable<Recoleccion> {
    return this.changeRecoleccionStatus(id, 'cancelada');
  }
}
