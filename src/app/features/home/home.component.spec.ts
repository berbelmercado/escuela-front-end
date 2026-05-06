import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';
import { routes } from '../../app.routes';

describe('HomeComponent', () => {
  it('should render access links for all modules', async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

    const fixture = TestBed.createComponent(HomeComponent);
    await fixture.whenStable();

    const links = Array.from(fixture.nativeElement.querySelectorAll('a')).map((link) => (link as HTMLAnchorElement).textContent?.trim() ?? '');

    expect(links.some((text) => text.includes('Estudiantes'))).toBe(true);
    expect(links.some((text) => text.includes('Cursos'))).toBe(true);
    expect(links.some((text) => text.includes('Usuarios'))).toBe(true);
    expect(links.some((text) => text.includes('Profesores'))).toBe(true);
    expect(links.some((text) => text.includes('Asignaturas'))).toBe(true);
    expect(links.some((text) => text.includes('Inscripciones'))).toBe(true);
    expect(links.some((text) => text.includes('Calificaciones'))).toBe(true);
  });

  it('should be the root route', () => {
    const homeRoute = routes.find((route) => route.path === '');

    expect(homeRoute?.component).toBe(HomeComponent);
  });
});
