import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Profesor {
  id_profesor: string;
  cedula: string;
  nombre: string;
  apellido: string;
  sexo: string;
  edad: number;
}

export interface ProfesorCreate {
  cedula: string;
  nombre: string;
  apellido: string;
  sexo: string;
  edad: number;
}

export interface ProfesorResponse extends Profesor {
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ProfesoresService {
  private apiUrl = 'http://localhost:8000/profesores';

  constructor(private http: HttpClient) {}

  getProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(`${this.apiUrl}/`);
  }

  getProfesor(id: string): Observable<Profesor> {
    return this.http.get<Profesor>(`${this.apiUrl}/${id}`);
  }

  createProfesor(data: ProfesorCreate): Observable<ProfesorResponse> {
    return this.http.post<ProfesorResponse>(`${this.apiUrl}/`, data);
  }

  updateProfesor(id: string, data: ProfesorCreate): Observable<ProfesorResponse> {
    return this.http.put<ProfesorResponse>(`${this.apiUrl}/${id}`, data);
  }

  deleteProfesor(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
