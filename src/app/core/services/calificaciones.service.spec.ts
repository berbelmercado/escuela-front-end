import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CalificacionCreate, CalificacionesService } from './calificaciones.service';

describe('CalificacionesService', () => {
  let service: CalificacionesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CalificacionesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should list calificaciones from the API', () => {
    service.getCalificaciones().subscribe((calificaciones) => {
      expect(calificaciones[0].id_calificacion).toBe(1);
    });

    const req = http.expectOne('http://localhost:8000/calificaciones/');
    expect(req.request.method).toBe('GET');
    req.flush([{ id_calificacion: 1, id_estudiante: 'estudiante-1', id_profesor: 'profesor-1', id_asignatura: 2, descripcion_nota: 'Parcial', valor_nota: 4.5 }]);
  });

  it('should create a calificacion', () => {
    const payload: CalificacionCreate = {
      id_estudiante: 'estudiante-1',
      id_profesor: 'profesor-1',
      id_asignatura: 2,
      descripcion_nota: 'Parcial',
      valor_nota: 4.5,
    };

    service.createCalificacion(payload).subscribe((response) => {
      expect(response.message).toBe('ok');
    });

    const req = http.expectOne('http://localhost:8000/calificaciones/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id_calificacion: 1, ...payload, message: 'ok' });
  });
});
