import { routes } from './app.routes';
import { HomeComponent } from './features/home/home.component';

describe('routes', () => {
  it('should expose the backend resources as pages', () => {
    const routePaths = routes.map((route) => route.path);

    expect(routePaths).toContain('');
    expect(routePaths).toContain('profesores');
    expect(routePaths).toContain('asignaturas');
    expect(routePaths).toContain('inscripciones');
    expect(routePaths).toContain('calificaciones');
  });

  it('should route the root path to HomeComponent', () => {
    const homeRoute = routes.find((route) => route.path === '');

    expect(homeRoute?.component).toBe(HomeComponent);
  });
});
