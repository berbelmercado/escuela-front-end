import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Curso, CursosService } from '../../core/services/cursos.service';
import { Estudiante, EstudiantesService } from '../../core/services/estudiantes.service';
import { Asignatura, AsignaturasService } from '../../core/services/asignaturas.service';
import { Profesor, ProfesoresService } from '../../core/services/profesores.service';
import { Inscripcion, InscripcionCreate, InscripcionesService } from '../../core/services/inscripciones.service';

@Component({
  selector: 'app-inscripciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InscripcionesComponent implements OnInit {
  inscripciones: Inscripcion[] = [];
  cursos: Curso[] = [];
  estudiantes: Estudiante[] = [];
  asignaturas: Asignatura[] = [];
  profesores: Profesor[] = [];
  form!: FormGroup;
  editandoId: number | null = null;
  mensaje = '';
  error = '';
  cargando = false;

  constructor(
    private inscripcionesService: InscripcionesService,
    private cursosService: CursosService,
    private estudiantesService: EstudiantesService,
    private asignaturasService: AsignaturasService,
    private profesoresService: ProfesoresService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarCatalogos();
    this.cargarInscripciones();
  }

  initForm(): void {
    this.form = this.fb.group({
      id_curso: ['', Validators.required],
      id_asignatura: ['', Validators.required],
      id_estudiante: ['', Validators.required],
      id_profesor: ['', Validators.required],
      periodo: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  cargarCatalogos(): void {
    this.cursosService.getCursos().subscribe({
      next: data => { this.cursos = data; this.cdr.markForCheck(); },
      error: () => { this.cursos = []; this.cdr.markForCheck(); },
    });
    this.estudiantesService.getEstudiantes().subscribe({
      next: data => { this.estudiantes = data; this.cdr.markForCheck(); },
      error: () => { this.estudiantes = []; this.cdr.markForCheck(); },
    });
    this.asignaturasService.getAsignaturas().subscribe({
      next: data => { this.asignaturas = data; this.cdr.markForCheck(); },
      error: () => { this.asignaturas = []; this.cdr.markForCheck(); },
    });
    this.profesoresService.getProfesores().subscribe({
      next: data => { this.profesores = data; this.cdr.markForCheck(); },
      error: () => { this.profesores = []; this.cdr.markForCheck(); },
    });
  }

  cargarInscripciones(): void {
    this.cargando = true;
    this.inscripciones = [];
    this.inscripcionesService.getInscripciones().subscribe({
      next: data => {
        this.inscripciones = data;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: err => {
        this.inscripciones = [];
        this.error = err.status === 404 ? 'No hay inscripciones registradas.' : 'Error al cargar inscripciones.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const payload: InscripcionCreate = {
      ...this.form.value,
      id_asignatura: Number(this.form.value.id_asignatura),
    };
    this.mensaje = '';
    this.error = '';

    if (this.editandoId !== null) {
      this.inscripcionesService.updateInscripcion(this.editandoId, payload).subscribe({
        next: res => {
          this.mensaje = res.message || 'Inscripcion actualizada.';
          this.resetForm();
          this.cargarInscripciones();
        },
        error: err => {
          this.error = err.error?.detail || 'Error al actualizar.';
          this.cdr.markForCheck();
        }
      });
      return;
    }

    this.inscripcionesService.createInscripcion(payload).subscribe({
      next: res => {
        this.mensaje = res.message || 'Inscripcion registrada.';
        this.resetForm();
        this.cargarInscripciones();
      },
      error: err => {
        this.error = err.error?.detail || 'Error al registrar.';
        this.cdr.markForCheck();
      }
    });
  }

  editar(inscripcion: Inscripcion): void {
    this.editandoId = inscripcion.id_inscripcion;
    this.mensaje = '';
    this.error = '';
    this.form.patchValue(inscripcion);
    this.cdr.markForCheck();
  }

  eliminar(id: number): void {
    if (!confirm('Seguro de eliminar esta inscripcion?')) return;
    this.inscripcionesService.deleteInscripcion(id).subscribe({
      next: res => {
        this.mensaje = res.message;
        this.error = '';
        this.cargarInscripciones();
      },
      error: err => {
        this.error = err.error?.detail || 'Error al eliminar.';
        this.cdr.markForCheck();
      }
    });
  }

  nombreCurso(id: string): string {
    return this.cursos.find(curso => curso.id_curso === id)?.nombre_curso || id;
  }

  nombreEstudiante(id: string): string {
    const estudiante = this.estudiantes.find(item => item.id_estudiante === id);
    return estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : id;
  }

  nombreAsignatura(id: number): string {
    return this.asignaturas.find(asignatura => asignatura.id_asignatura === id)?.nombre_asignatura || String(id);
  }

  nombreProfesor(id: string): string {
    const profesor = this.profesores.find(item => item.id_profesor === id);
    return profesor ? `${profesor.nombre} ${profesor.apellido}` : id;
  }

  resetForm(): void {
    this.form.reset();
    this.editandoId = null;
  }

  cancelar(): void {
    this.resetForm();
    this.mensaje = '';
    this.error = '';
    this.cdr.markForCheck();
  }

  campo(name: string) {
    return this.form.get(name);
  }
}
