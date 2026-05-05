import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Profesor, ProfesorCreate, ProfesoresService } from '../../core/services/profesores.service';

@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfesoresComponent implements OnInit {
  profesores: Profesor[] = [];
  form!: FormGroup;
  editandoId: string | null = null;
  mensaje = '';
  error = '';
  cargando = false;

  constructor(
    private profesoresService: ProfesoresService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarProfesores();
  }

  initForm(): void {
    this.form = this.fb.group({
      cedula: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.maxLength(100)]],
      sexo: ['', [Validators.required, Validators.maxLength(20)]],
      edad: [0, [Validators.required, Validators.min(0)]],
    });
  }

  cargarProfesores(): void {
    this.cargando = true;
    this.profesores = [];
    this.profesoresService.getProfesores().subscribe({
      next: data => {
        this.profesores = data;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: err => {
        this.profesores = [];
        this.error = err.status === 404 ? 'No hay profesores registrados.' : 'Error al cargar profesores.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const payload: ProfesorCreate = this.form.value;
    this.mensaje = '';
    this.error = '';

    if (this.editandoId) {
      this.profesoresService.updateProfesor(this.editandoId, payload).subscribe({
        next: res => {
          this.mensaje = res.message || 'Profesor actualizado.';
          this.resetForm();
          this.cargarProfesores();
        },
        error: err => {
          this.error = err.error?.detail || 'Error al actualizar.';
          this.cdr.markForCheck();
        }
      });
      return;
    }

    this.profesoresService.createProfesor(payload).subscribe({
      next: res => {
        this.mensaje = res.message || 'Profesor registrado.';
        this.resetForm();
        this.cargarProfesores();
      },
      error: err => {
        this.error = err.error?.detail || 'Error al registrar.';
        this.cdr.markForCheck();
      }
    });
  }

  editar(profesor: Profesor): void {
    this.editandoId = profesor.id_profesor;
    this.mensaje = '';
    this.error = '';
    this.form.patchValue(profesor);
    this.cdr.markForCheck();
  }

  eliminar(id: string): void {
    if (!confirm('Seguro de eliminar este profesor?')) return;
    this.profesoresService.deleteProfesor(id).subscribe({
      next: res => {
        this.mensaje = res.message;
        this.error = '';
        this.cargarProfesores();
      },
      error: err => {
        this.error = err.error?.detail || 'Error al eliminar.';
        this.cdr.markForCheck();
      }
    });
  }

  resetForm(): void {
    this.form.reset({ edad: 0 });
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
