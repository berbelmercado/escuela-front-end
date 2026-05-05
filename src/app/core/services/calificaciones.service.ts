import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Calificacion {
  id_calificacion: number;
  id_estudiante: string;
  id_profesor: string;
  id_asignatura: number;
  descripcion_nota: string;
  valor_nota: number;
}

export interface CalificacionCreate {
  id_estudiante: string;
  id_profesor: string;
  id_asignatura: number;
  descripcion_nota: string;
  valor_nota: number;
}

export interface CalificacionResponse extends Calificacion {
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class CalificacionesService {
  private apiUrl = 'http://localhost:8000/calificaciones';

  constructor(private http: HttpClient) {}

  getCalificaciones(): Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(`${this.apiUrl}/`);
  }

  getCalificacion(id: number): Observable<Calificacion> {
    return this.http.get<Calificacion>(`${this.apiUrl}/${id}`);
  }

  createCalificacion(data: CalificacionCreate): Observable<CalificacionResponse> {
    return this.http.post<CalificacionResponse>(`${this.apiUrl}/`, data);
  }

  updateCalificacion(id: number, data: CalificacionCreate): Observable<CalificacionResponse> {
    return this.http.put<CalificacionResponse>(`${this.apiUrl}/${id}`, data);
  }

  deleteCalificacion(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
