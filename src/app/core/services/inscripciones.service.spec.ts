import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { InscripcionCreate, InscripcionesService } from './inscripciones.service';

describe('InscripcionesService', () => {
  let service: InscripcionesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(InscripcionesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should list inscripciones from the API', () => {
    service.getInscripciones().subscribe((inscripciones) => {
      expect(inscripciones[0].id_inscripcion).toBe(1);
    });

    const req = http.expectOne('http://localhost:8000/inscripciones/');
    expect(req.request.method).toBe('GET');
    req.flush([{ id_inscripcion: 1, id_curso: 'curso-1', id_asignatura: 2, id_estudiante: 'estudiante-1', id_profesor: 'profesor-1', periodo: '2026-1' }]);
  });

  it('should delete an inscripcion', () => {
    service.deleteInscripcion(1).subscribe((response) => {
      expect(response.message).toBe('ok');
    });

    const req = http.expectOne('http://localhost:8000/inscripciones/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'ok' });
  });
});
