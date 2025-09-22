import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MaterialDetail {
  name: string;
  unit: string;
  quantity: number;
  totalValue: number;
}

export interface MaterialType {
  name: string;
  label: string;
  pointsPerKg: number;
}

export interface PointsRecord {
  id: number;
  userId: number;
  details: MaterialDetail[];
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CreatePointsRequest {
  userId: number;
  details: MaterialDetail[];
}

export interface UpdatePointsRequest {
  id: number;
  userId: number;
  details: MaterialDetail[];
}

@Injectable({ providedIn: 'root' })
export class PointsService {
  private apiUrl = 'http://localhost:3000';
  private http = inject(HttpClient);

  /**
   * Obtiene todos los registros de puntos
   */
  getPointsRecords(): Observable<PointsRecord[]> {
    return this.http.get<PointsRecord[]>(`${this.apiUrl}/points`);
  }

  /**
   * Obtiene un registro de puntos por ID
   */
  getPointsRecord(id: number): Observable<PointsRecord> {
    return this.http.get<PointsRecord>(`${this.apiUrl}/points/${id}`);
  }

  /**
   * Crea un nuevo registro de puntos
   */
  createPointsRecord(data: CreatePointsRequest): Observable<PointsRecord> {
    return this.http.post<PointsRecord>(`${this.apiUrl}/deposit/add-deposit`, data);
  }

  /**
   * Actualiza un registro de puntos existente
   */
  updatePointsRecord(data: UpdatePointsRequest): Observable<PointsRecord> {
    return this.http.put<PointsRecord>(`${this.apiUrl}/points/${data.id}`, data);
  }

  /**
   * Elimina un registro de puntos
   */
  deletePointsRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/points/${id}`);
  }

  /**
   * Cambia el estado de un registro de puntos
   */
  changePointsStatus(id: number, status: 'approved' | 'rejected'): Observable<PointsRecord> {
    return this.http.patch<PointsRecord>(`${this.apiUrl}/points/${id}/status`, { status });
  }

  /**
   * Obtiene registros de puntos por usuario
   */
  getPointsRecordsByUser(userId: number): Observable<PointsRecord[]> {
    return this.http.get<PointsRecord[]>(`${this.apiUrl}/points/user/${userId}`);
  }

  /**
   * Obtiene estadísticas de puntos
   */
  getPointsStats(): Observable<{
    totalPoints: number;
    pendingRecords: number;
    approvedRecords: number;
    rejectedRecords: number;
  }> {
    return this.http.get<{
      totalPoints: number;
      pendingRecords: number;
      approvedRecords: number;
      rejectedRecords: number;
    }>(`${this.apiUrl}/points/stats`);
  }
}
