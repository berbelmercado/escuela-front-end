import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Asignatura, AsignaturaCreate, AsignaturasService } from '../../core/services/asignaturas.service';

@Component({
  selector: 'app-asignaturas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './asignaturas.component.html',
  styleUrls: ['./asignaturas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsignaturasComponent implements OnInit {
  asignaturas: Asignatura[] = [];
  form!: FormGroup;
  editandoId: number | null = null;
  mensaje = '';
  error = '';
  cargando = false;

  constructor(
    private asignaturasService: AsignaturasService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarAsignaturas();
  }

  initForm(): void {
    this.form = this.fb.group({
      nombre_asignatura: ['', [Validators.required, Validators.maxLength(100)]],
      horas_semanales: [1, [Validators.required, Validators.min(1)]],
      modalidad: ['', [Validators.required, Validators.maxLength(50)]],
      estado: [true, Validators.required],
    });
  }

  cargarAsignaturas(): void {
    this.cargando = true;
    this.asignaturas = [];
    this.asignaturasService.getAsignaturas().subscribe({
      next: data => {
        this.asignaturas = data;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: err => {
        this.asignaturas = [];
        this.error = err.status === 404 ? 'No hay asignaturas registradas.' : 'Error al cargar asignaturas.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const payload: AsignaturaCreate = this.form.value;
    this.mensaje = '';
    this.error = '';

    if (this.editandoId !== null) {
      this.asignaturasService.updateAsignatura(this.editandoId, payload).subscribe({
        next: res => {
          this.mensaje = res.message || 'Asignatura actualizada.';
          this.resetForm();
          this.cargarAsignaturas();
        },
        error: err => {
          this.error = err.error?.detail || 'Error al actualizar.';
          this.cdr.markForCheck();
        }
      });
      return;
    }

    this.asignaturasService.createAsignatura(payload).subscribe({
      next: res => {
        this.mensaje = res.message || 'Asignatura registrada.';
        this.resetForm();
        this.cargarAsignaturas();
      },
      error: err => {
        this.error = err.error?.detail || 'Error al registrar.';
        this.cdr.markForCheck();
      }
    });
  }

  editar(asignatura: Asignatura): void {
    this.editandoId = asignatura.id_asignatura;
    this.mensaje = '';
    this.error = '';
    this.form.patchValue(asignatura);
    this.cdr.markForCheck();
  }

  eliminar(id: number): void {
    if (!confirm('Seguro de eliminar esta asignatura?')) return;
    this.asignaturasService.deleteAsignatura(id).subscribe({
      next: res => {
        this.mensaje = res.message;
        this.error = '';
        this.cargarAsignaturas();
      },
      error: err => {
        this.error = err.error?.detail || 'Error al eliminar.';
        this.cdr.markForCheck();
      }
    });
  }

  resetForm(): void {
    this.form.reset({ horas_semanales: 1, estado: true });
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
