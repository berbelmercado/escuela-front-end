import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Asignatura {
  id_asignatura: number;
  nombre_asignatura: string;
  horas_semanales: number;
  modalidad: string;
  estado: boolean;
}

export interface AsignaturaCreate {
  nombre_asignatura: string;
  horas_semanales: number;
  modalidad: string;
  estado: boolean;
}

export interface AsignaturaResponse extends Asignatura {
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AsignaturasService {
  private apiUrl = 'http://localhost:8000/asignaturas';

  constructor(private http: HttpClient) {}

  getAsignaturas(): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(`${this.apiUrl}/`);
  }

  getAsignatura(id: number): Observable<Asignatura> {
    return this.http.get<Asignatura>(`${this.apiUrl}/${id}`);
  }

  createAsignatura(data: AsignaturaCreate): Observable<AsignaturaResponse> {
    return this.http.post<AsignaturaResponse>(`${this.apiUrl}/`, data);
  }

  updateAsignatura(id: number, data: AsignaturaCreate): Observable<AsignaturaResponse> {
    return this.http.put<AsignaturaResponse>(`${this.apiUrl}/${id}`, data);
  }

  deleteAsignatura(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
