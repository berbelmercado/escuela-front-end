import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProfesoresService, ProfesorCreate } from './profesores.service';

describe('ProfesoresService', () => {
  let service: ProfesoresService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProfesoresService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should list profesores from the API', () => {
    service.getProfesores().subscribe((profesores) => {
      expect(profesores[0].id_profesor).toBe('profesor-1');
    });

    const req = http.expectOne('http://localhost:8000/profesores/');
    expect(req.request.method).toBe('GET');
    req.flush([{ id_profesor: 'profesor-1', cedula: '123', nombre: 'Ana', apellido: 'Ruiz', sexo: 'F', edad: 34 }]);
  });

  it('should create a profesor', () => {
    const payload: ProfesorCreate = { cedula: '123', nombre: 'Ana', apellido: 'Ruiz', sexo: 'F', edad: 34 };

    service.createProfesor(payload).subscribe((response) => {
      expect(response.message).toBe('ok');
    });

    const req = http.expectOne('http://localhost:8000/profesores/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id_profesor: 'profesor-1', ...payload, message: 'ok' });
  });
});
