import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

type HomeLink = {
  title: string;
  description: string;
  path: string;
  accent: string;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  readonly links: HomeLink[] = [
    {
      title: 'Estudiantes',
      description: 'Gestion de registros academicos de estudiantes.',
      path: '/estudiantes',
      accent: 'accent-blue',
    },
    {
      title: 'Cursos',
      description: 'Administracion de cursos y su informacion basica.',
      path: '/cursos',
      accent: 'accent-gold',
    },
    {
      title: 'Usuarios',
      description: 'Consulta de usuarios consumidos desde la API publica.',
      path: '/usuarios',
      accent: 'accent-teal',
    },
    {
      title: 'Profesores',
      description: 'Alta, consulta y edicion de profesores.',
      path: '/profesores',
      accent: 'accent-coral',
    },
    {
      title: 'Asignaturas',
      description: 'Catalogo de asignaturas con horas, modalidad y estado.',
      path: '/asignaturas',
      accent: 'accent-green',
    },
    {
      title: 'Inscripciones',
      description: 'Relacion entre curso, asignatura, estudiante y profesor.',
      path: '/inscripciones',
      accent: 'accent-violet',
    },
    {
      title: 'Calificaciones',
      description: 'Registro y consulta de calificaciones por asignatura.',
      path: '/calificaciones',
      accent: 'accent-red',
    },
  ];
}
