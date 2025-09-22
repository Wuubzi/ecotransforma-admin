import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Oferta {
  id_offer: number;
  name: string;
  description: string;
  cost: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  disponible?: boolean;
}

export interface CreateOfertaRequest {
  name: string;
  description: string;
  cost: number;
  category: string;
}

export interface UpdateOfertaRequest {
  id: number;
  name?: string;
  description?: string;
  cost?: number;
  category?: string;
  disponible?: boolean;
}

@Injectable({ providedIn: 'root' })
export class OfertasService {
  private apiUrl = 'http://localhost:3000/ofertas';
  private http = inject(HttpClient);

  /**
   * Obtiene todas las ofertas
   */
  getOfertas(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`http://localhost:3000/offers/get-all-offers`);
  }

  /**
   * Obtiene ofertas por categoría
   */
  getOfertasByCategory(category: string): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${this.apiUrl}?category=${encodeURIComponent(category)}`);
  }

  /**
   * Obtiene ofertas disponibles solamente
   */
  getOfertasDisponibles(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${this.apiUrl}?disponible=true`);
  }

  /**
   * Obtiene una oferta por ID
   */
  getOferta(id: number): Observable<Oferta> {
    return this.http.get<Oferta>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea una nueva oferta
   */
  createOferta(data: CreateOfertaRequest): Observable<Oferta> {
    return this.http.post<Oferta>(`http://localhost:3000/offers/add-offers`, data);
  }

  /**
   * Elimina una oferta
   */
  deleteOferta(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/offers/delete-offer?id_offer=${id}`);
  }

  /**
   * Cambia la disponibilidad de una oferta
   */
  toggleDisponibilidad(id: number, disponible: boolean): Observable<Oferta> {
    return this.http.patch<Oferta>(`${this.apiUrl}/${id}/disponibilidad`, { disponible });
  }

  /**
   * Busca ofertas por nombre o descripción
   */
  searchOfertas(query: string): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Obtiene ofertas por rango de precio
   */
  getOfertasByPriceRange(minPrice: number, maxPrice: number): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${this.apiUrl}/precio?min=${minPrice}&max=${maxPrice}`);
  }

  /**
   * Obtiene estadísticas de ofertas
   */
  getOfertasStats(): Observable<{
    totalOfertas: number;
    disponibles: number;
    noDisponibles: number;
    categorias: { [key: string]: number };
    promedioPrecios: number;
    nuevasOfertasEsteMes: number;
  }> {
    return this.http.get<{
      totalOfertas: number;
      disponibles: number;
      noDisponibles: number;
      categorias: { [key: string]: number };
      promedioPrecios: number;
      nuevasOfertasEsteMes: number;
    }>(`${this.apiUrl}/stats`);
  }

  /**
   * Obtiene todas las categorías disponibles
   */
  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categorias`);
  }
}
