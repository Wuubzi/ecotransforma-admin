import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id_user: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  totalPoints?: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UpdateUserRequest {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: 'active' | 'inactive';
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  private http = inject(HttpClient);

  /**
   * Obtiene todos los usuarios
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/get-users`);
  }

  /**
   * Obtiene usuarios activos solamente
   */
  getActiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users?status=active`);
  }

  /**
   * Obtiene un usuario por ID
   */
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  /**
   * Crea un nuevo usuario
   */
  createUser(data: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, data);
  }

  /**
   * Actualiza un usuario existente
   */
  updateUser(data: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${data.id}`, data);
  }

  /**
   * Elimina un usuario
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  /**
   * Busca usuarios por nombre o email
   */
  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Obtiene el historial de puntos de un usuario
   */
  getUserPointsHistory(userId: number): Observable<{
    totalPoints: number;
    records: Array<{
      id: number;
      points: number;
      date: Date;
      status: string;
      materials: string[];
    }>;
  }> {
    return this.http.get<{
      totalPoints: number;
      records: Array<{
        id: number;
        points: number;
        date: Date;
        status: string;
        materials: string[];
      }>;
    }>(`${this.apiUrl}/users/${userId}/points-history`);
  }

  /**
   * Obtiene estadísticas de usuarios
   */
  getUsersStats(): Observable<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    newUsersThisMonth: number;
  }> {
    return this.http.get<{
      totalUsers: number;
      activeUsers: number;
      inactiveUsers: number;
      newUsersThisMonth: number;
    }>(`${this.apiUrl}/users/stats`);
  }
}
