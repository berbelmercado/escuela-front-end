import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Estudiante, EstudiantesService } from '../../core/services/estudiantes.service';
import { Asignatura, AsignaturasService } from '../../core/services/asignaturas.service';
import { Profesor, ProfesoresService } from '../../core/services/profesores.service';
import { Calificacion, CalificacionCreate, CalificacionesService } from '../../core/services/calificaciones.service';

@Component({
  selector: 'app-calificaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calificaciones.component.html',
  styleUrls: ['./calificaciones.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalificacionesComponent implements OnInit {
  calificaciones: Calificacion[] = [];
  estudiantes: Estudiante[] = [];
  asignaturas: Asignatura[] = [];
  profesores: Profesor[] = [];
  form!: FormGroup;
  editandoId: number | null = null;
  mensaje = '';
  error = '';
  cargando = false;

  constructor(
    private calificacionesService: CalificacionesService,
    private estudiantesService: EstudiantesService,
    private asignaturasService: AsignaturasService,
    private profesoresService: ProfesoresService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarCatalogos();
    this.cargarCalificaciones();
  }

  initForm(): void {
    this.form = this.fb.group({
      id_estudiante: ['', Validators.required],
      id_profesor: ['', Validators.required],
      id_asignatura: ['', Validators.required],
      descripcion_nota: ['', [Validators.required, Validators.maxLength(200)]],
      valor_nota: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    });
  }

  cargarCatalogos(): void {
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

  cargarCalificaciones(): void {
    this.cargando = true;
    this.calificaciones = [];
    this.calificacionesService.getCalificaciones().subscribe({
      next: data => {
        this.calificaciones = data;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: err => {
        this.calificaciones = [];
        this.error = err.status === 404 ? 'No hay calificaciones registradas.' : 'Error al cargar calificaciones.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const payload: CalificacionCreate = {
      ...this.form.value,
      id_asignatura: Number(this.form.value.id_asignatura),
      valor_nota: Number(this.form.value.valor_nota),
    };
    this.mensaje = '';
    this.error = '';

    if (this.editandoId !== null) {
      this.calificacionesService.updateCalificacion(this.editandoId, payload).subscribe({
        next: res => {
          this.mensaje = res.message || 'Calificacion actualizada.';
          this.resetForm();
          this.cargarCalificaciones();
        },
        error: err => {
          this.error = err.error?.detail || 'Error al actualizar.';
          this.cdr.markForCheck();
        }
      });
      return;
    }

    this.calificacionesService.createCalificacion(payload).subscribe({
      next: res => {
        this.mensaje = res.message || 'Calificacion registrada.';
        this.resetForm();
        this.cargarCalificaciones();
      },
      error: err => {
        this.error = err.error?.detail || 'Error al registrar.';
        this.cdr.markForCheck();
      }
    });
  }

  editar(calificacion: Calificacion): void {
    this.editandoId = calificacion.id_calificacion;
    this.mensaje = '';
    this.error = '';
    this.form.patchValue(calificacion);
    this.cdr.markForCheck();
  }

  eliminar(id: number): void {
    if (!confirm('Seguro de eliminar esta calificacion?')) return;
    this.calificacionesService.deleteCalificacion(id).subscribe({
      next: res => {
        this.mensaje = res.message;
        this.error = '';
        this.cargarCalificaciones();
      },
      error: err => {
        this.error = err.error?.detail || 'Error al eliminar.';
        this.cdr.markForCheck();
      }
    });
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
    this.form.reset({ valor_nota: 0 });
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
