import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AsignaturaCreate, AsignaturasService } from './asignaturas.service';

describe('AsignaturasService', () => {
  let service: AsignaturasService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AsignaturasService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should list asignaturas from the API', () => {
    service.getAsignaturas().subscribe((asignaturas) => {
      expect(asignaturas[0].id_asignatura).toBe(1);
    });

    const req = http.expectOne('http://localhost:8000/asignaturas/');
    expect(req.request.method).toBe('GET');
    req.flush([{ id_asignatura: 1, nombre_asignatura: 'Matematicas', horas_semanales: 4, modalidad: 'Presencial', estado: true }]);
  });

  it('should update an asignatura', () => {
    const payload: AsignaturaCreate = {
      nombre_asignatura: 'Matematicas',
      horas_semanales: 4,
      modalidad: 'Presencial',
      estado: true,
    };

    service.updateAsignatura(1, payload).subscribe((response) => {
      expect(response.message).toBe('ok');
    });

    const req = http.expectOne('http://localhost:8000/asignaturas/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ id_asignatura: 1, ...payload, message: 'ok' });
  });
});
