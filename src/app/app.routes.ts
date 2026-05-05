import { Routes } from '@angular/router';
import { UsuariosComponent } from './features/usuarios/usuarios.component';
import { EstudiantesComponent } from './features/estudiantes/estudiantes.component';
import { CursosComponent } from './features/cursos/cursos.component';
import { ProfesoresComponent } from './features/profesores/profesores.component';
import { AsignaturasComponent } from './features/asignaturas/asignaturas.component';
import { InscripcionesComponent } from './features/inscripciones/inscripciones.component';
import { CalificacionesComponent } from './features/calificaciones/calificaciones.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'estudiantes', component: EstudiantesComponent },
  { path: 'cursos',      component: CursosComponent },
  { path: 'profesores', component: ProfesoresComponent },
  { path: 'asignaturas', component: AsignaturasComponent },
  { path: 'inscripciones', component: InscripcionesComponent },
  { path: 'calificaciones', component: CalificacionesComponent },
];
