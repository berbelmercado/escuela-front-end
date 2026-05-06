import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Inscripcion {
  id_inscripcion: number;
  id_curso: string;
  id_asignatura: number;
  id_estudiante: string;
  id_profesor: string;
  periodo: string;
}

export interface InscripcionCreate {
  id_curso: string;
  id_asignatura: number;
  id_estudiante: string;
  id_profesor: string;
  periodo: string;
}

export interface InscripcionResponse extends Inscripcion {
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class InscripcionesService {
  private apiUrl = 'http://localhost:8000/inscripciones';

  constructor(private http: HttpClient) {}

  getInscripciones(): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(`${this.apiUrl}/`);
  }

  getInscripcion(id: number): Observable<Inscripcion> {
    return this.http.get<Inscripcion>(`${this.apiUrl}/${id}`);
  }

  createInscripcion(data: InscripcionCreate): Observable<InscripcionResponse> {
    return this.http.post<InscripcionResponse>(`${this.apiUrl}/`, data);
  }

  updateInscripcion(id: number, data: InscripcionCreate): Observable<InscripcionResponse> {
    return this.http.put<InscripcionResponse>(`${this.apiUrl}/${id}`, data);
  }

  deleteInscripcion(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
