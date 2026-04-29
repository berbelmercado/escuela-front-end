import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Curso {
  id_curso: string;
  nombre_curso: string;
  fecha_creacion?: string;
}

export interface CursoCreate {
  nombre: string;
}

export interface CursoResponse {
  id: string;
  nombre: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class CursosService {
  private apiUrl = 'http://localhost:8000/cursos';

  constructor(private http: HttpClient) {}

  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/`);
  }

  getCurso(id: string): Observable<Curso> {
    return this.http.get<Curso>(`${this.apiUrl}/${id}`);
  }

  createCurso(data: CursoCreate): Observable<CursoResponse> {
    return this.http.post<CursoResponse>(`${this.apiUrl}/`, data);
  }

  updateCurso(id: string, data: CursoCreate): Observable<CursoResponse> {
    return this.http.put<CursoResponse>(`${this.apiUrl}/${id}`, data);
  }

  deleteCurso(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}