import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Voluntario {
  id: number;
  names: string;
  email: string;
  number_phone: string;
  address: string;
  time_disponibility: string;
  day_week: string[];
  fechaRegistro: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'activo' | 'inactivo';
  avatar?: string;
  recoleccionesParticipadas: number;
}

export interface CreateVoluntarioRequest {
  names: string;
  email: string;
  number_phone: string;
  address: string;
  time_disponibility: string;
  day_week: string[];
}

export interface UpdateVoluntarioRequest {
  id: number;
  names?: string;
  email?: string;
  number_phone?: string;
  address?: string;
  time_disponibility?: string;
  day_week?: string[];
  estado?: 'pendiente' | 'aprobado' | 'rechazado' | 'activo' | 'inactivo';
  avatar?: string;
}

@Injectable({ providedIn: 'root' })
export class VoluntariosService {
  private apiUrl = 'http://localhost:3000/voluntarios';
  private http = inject(HttpClient);

  /**
   * Obtiene todos los voluntarios
   */
  getVoluntarios(): Observable<Voluntario[]> {
    return this.http.get<Voluntario[]>(`http://localhost:3000/landing/voluntarios`);
  }

  /**
   * Obtiene voluntarios por estado
   */
  getVoluntariosByEstado(estado: string): Observable<Voluntario[]> {
    return this.http.get<Voluntario[]>(`${this.apiUrl}/voluntarios?estado=${estado}`);
  }

  /**
   * Obtiene voluntarios activos solamente
   */
  getVoluntariosActivos(): Observable<Voluntario[]> {
    return this.http.get<Voluntario[]>(`${this.apiUrl}/voluntarios?estado=activo`);
  }

  /**
   * Obtiene un voluntario por ID
   */
  getVoluntario(id: number): Observable<Voluntario> {
    return this.http.get<Voluntario>(`${this.apiUrl}/voluntarios/${id}`);
  }

  /**
   * Crea un nuevo voluntario
   */
  createVoluntario(data: CreateVoluntarioRequest): Observable<Voluntario> {
    return this.http.post<Voluntario>(`${this.apiUrl}/voluntarios`, data);
  }

  /**
   * Actualiza un voluntario existente
   */
  updateVoluntario(data: UpdateVoluntarioRequest): Observable<Voluntario> {
    return this.http.put<Voluntario>(`${this.apiUrl}/voluntarios/${data.id}`, data);
  }

  /**
   * Elimina un voluntario
   */
  deleteVoluntario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/voluntarios/${id}`);
  }

  /**
   * Cambia el estado de un voluntario
   */
  changeVoluntarioStatus(
    id: number,
    estado: 'pendiente' | 'aprobado' | 'rechazado' | 'activo' | 'inactivo'
  ): Observable<Voluntario> {
    return this.http.patch<Voluntario>(`${this.apiUrl}/voluntarios/${id}/status`, { estado });
  }

  /**
   * Busca voluntarios por nombre o email
   */
  searchVoluntarios(query: string): Observable<Voluntario[]> {
    return this.http.get<Voluntario[]>(
      `${this.apiUrl}/voluntarios/search?q=${encodeURIComponent(query)}`
    );
  }

  /**
   * Obtiene voluntarios por disponibilidad de días
   */
  getVoluntariosByDayWeek(day: string): Observable<Voluntario[]> {
    return this.http.get<Voluntario[]>(
      `${this.apiUrl}/voluntarios/disponibilidad/${encodeURIComponent(day)}`
    );
  }

  /**
   * Obtiene voluntarios por horario de disponibilidad
   */
  getVoluntariosByTimeDisponibility(timeSlot: string): Observable<Voluntario[]> {
    return this.http.get<Voluntario[]>(
      `${this.apiUrl}/voluntarios/horario/${encodeURIComponent(timeSlot)}`
    );
  }

  /**
   * Obtiene el historial de recolecciones de un voluntario
   */
  getVoluntarioRecolecciones(voluntarioId: number): Observable<{
    totalParticipaciones: number;
    recolecciones: Array<{
      id: number;
      fecha: string;
      direccion: string;
      tipoMaterial: string;
      estado: string;
    }>;
  }> {
    return this.http.get<{
      totalParticipaciones: number;
      recolecciones: Array<{
        id: number;
        fecha: string;
        direccion: string;
        tipoMaterial: string;
        estado: string;
      }>;
    }>(`${this.apiUrl}/voluntarios/${voluntarioId}/recolecciones`);
  }

  /**
   * Obtiene estadísticas de voluntarios
   */
  getVoluntariosStats(): Observable<{
    totalVoluntarios: number;
    pendientes: number;
    aprobados: number;
    activos: number;
    inactivos: number;
    rechazados: number;
    newVoluntariosThisMonth: number;
    participacionesPromedio: number;
  }> {
    return this.http.get<{
      totalVoluntarios: number;
      pendientes: number;
      aprobados: number;
      activos: number;
      inactivos: number;
      rechazados: number;
      newVoluntariosThisMonth: number;
      participacionesPromedio: number;
    }>(`${this.apiUrl}/voluntarios/stats`);
  }

  /**
   * Aprueba un voluntario
   */
  aprobarVoluntario(id: number): Observable<Voluntario> {
    return this.changeVoluntarioStatus(id, 'aprobado');
  }

  /**
   * Rechaza un voluntario
   */
  rechazarVoluntario(id: number): Observable<Voluntario> {
    return this.changeVoluntarioStatus(id, 'rechazado');
  }

  /**
   * Activa un voluntario
   */
  activarVoluntario(id: number): Observable<Voluntario> {
    return this.changeVoluntarioStatus(id, 'activo');
  }

  /**
   * Desactiva un voluntario
   */
  desactivarVoluntario(id: number): Observable<Voluntario> {
    return this.changeVoluntarioStatus(id, 'inactivo');
  }

  /**
   * Asigna un voluntario a una recolección
   */
  asignarARecoleccion(voluntarioId: number, recoleccionId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/voluntarios/${voluntarioId}/asignar`, {
      recoleccionId,
    });
  }

  /**
   * Incrementa el contador de participaciones de un voluntario
   */
  incrementarParticipaciones(voluntarioId: number): Observable<Voluntario> {
    return this.http.patch<Voluntario>(
      `${this.apiUrl}/voluntarios/${voluntarioId}/participacion`,
      {}
    );
  }
}
