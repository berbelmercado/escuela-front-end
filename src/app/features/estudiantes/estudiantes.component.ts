import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstudiantesService, Estudiante, EstudianteCreate } from '../../core/services/estudiantes.service';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush  // 👈
})
export class EstudiantesComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  form!: FormGroup;
  editandoId: string | null = null;
  mensaje: string = '';
  error: string = '';
  cargando: boolean = false;

  constructor(
    private estudiantesService: EstudiantesService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef  // 👈
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarEstudiantes();
  }

  initForm(): void {
    this.form = this.fb.group({
      cedula:           ['', [Validators.required, Validators.maxLength(20)]],
      nombre:           ['', [Validators.required, Validators.maxLength(100)]],
      apellido:         ['', [Validators.required, Validators.maxLength(100)]],
      email:            ['', [Validators.required, Validators.email]],
      sexo:             ['', [Validators.required, Validators.maxLength(8)]],
      fecha_nacimiento: ['', Validators.required],
      no_celular:       ['', Validators.maxLength(20)],
    });
  }

  cargarEstudiantes(): void {
    this.cargando = true;
    this.estudiantes = [];
    this.estudiantesService.getEstudiantes().subscribe({
      next: data => {
        this.estudiantes = data;
        this.cargando = false;
        this.cdr.markForCheck();  // 👈
      },
      error: err => {
        this.estudiantes = [];
        this.error = err.status === 404 ? 'No hay estudiantes registrados.' : 'Error al cargar estudiantes.';
        this.cargando = false;
        this.cdr.markForCheck();  // 👈
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const payload: EstudianteCreate = this.form.value;
    this.mensaje = '';
    this.error = '';

    if (this.editandoId) {
      this.estudiantesService.updateEstudiante(this.editandoId, payload).subscribe({
        next: res => {
          this.mensaje = res.message || 'Estudiante actualizado.';
          this.resetForm();
          this.cargarEstudiantes();
        },
        error: err => {
          this.error = err.error?.detail || 'Error al actualizar.';
          this.cdr.markForCheck();  // 👈
        }
      });
    } else {
      this.estudiantesService.createEstudiante(payload).subscribe({
        next: res => {
          this.mensaje = res.message || 'Estudiante registrado.';
          this.resetForm();
          this.cargarEstudiantes();
        },
        error: err => {
          this.error = err.error?.detail || 'Error al registrar.';
          this.cdr.markForCheck();  // 👈
        }
      });
    }
  }

  editar(estudiante: Estudiante): void {
    this.editandoId = estudiante.id_estudiante;
    this.mensaje = '';
    this.error = '';
    this.form.patchValue({
      cedula:           estudiante.cedula,
      nombre:           estudiante.nombre,
      apellido:         estudiante.apellido,
      email:            estudiante.email,
      sexo:             estudiante.sexo,
      fecha_nacimiento: estudiante.fecha_nacimiento,
      no_celular:       estudiante.no_celular || '',
    });
    this.cdr.markForCheck();  // 👈
  }

eliminar(id: string): void {
  if (!confirm('¿Estás seguro de eliminar este estudiante?')) return;
  this.estudiantesService.deleteEstudiante(id).subscribe({
    next: res => {
      this.mensaje = res.message;
      this.error = '';
      this.cargarEstudiantes();
    },
    error: err => {
      this.error = err.error?.detail || err.message || 'Error al eliminar.';  // 👈
      this.cdr.markForCheck();
    }
  });
}

  resetForm(): void {
    this.form.reset();
    this.editandoId = null;
  }

  cancelar(): void {
    this.resetForm();
    this.mensaje = '';
    this.error = '';
    this.cdr.markForCheck();  // 👈
  }

  campo(name: string) {
    return this.form.get(name);
  }
}