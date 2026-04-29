import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Estudiante {
  id_estudiante: string;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  sexo: string;
  fecha_nacimiento: string;
  no_celular?: string;
  fecha_creacion?: string;
}

export interface EstudianteCreate {
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  sexo: string;
  fecha_nacimiento: string;
  no_celular?: string;
}

export interface EstudianteResponse extends Estudiante {
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class EstudiantesService {
  private apiUrl = 'http://localhost:8000/estudiantes';

  constructor(private http: HttpClient) {}

  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}/`);
  }

  getEstudiante(id: string): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/${id}`);
  }

  createEstudiante(data: EstudianteCreate): Observable<EstudianteResponse> {
    return this.http.post<EstudianteResponse>(`${this.apiUrl}/`, data);
  }

  updateEstudiante(id: string, data: EstudianteCreate): Observable<EstudianteResponse> {
    return this.http.put<EstudianteResponse>(`${this.apiUrl}/${id}`, data);
  }

  deleteEstudiante(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}