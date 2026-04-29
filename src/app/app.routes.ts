import { Routes } from '@angular/router';
import { UsuariosComponent } from './features/usuarios/usuarios.component';
import { EstudiantesComponent } from './features/estudiantes/estudiantes.component';
import { CursosComponent } from './features/cursos/cursos.component';

export const routes: Routes = [
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'estudiantes', component: EstudiantesComponent },
  { path: 'cursos',      component: CursosComponent },
  { path: '',            redirectTo: 'estudiantes', pathMatch: 'full' },
];
