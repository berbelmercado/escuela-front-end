import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CursosService, Curso, CursoCreate } from '../../core/services/cursos.service';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush  // 👈
})
export class CursosComponent implements OnInit {
  cursos: Curso[] = [];
  form!: FormGroup;
  editandoId: string | null = null;
  mensaje: string = '';
  error: string = '';
  cargando: boolean = false;

  constructor(
    private cursosService: CursosService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef  // 👈
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarCursos();
  }

  initForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  cargarCursos(): void {
    this.cargando = true;
    this.cursos = [];
    this.cursosService.getCursos().subscribe({
      next: data => {
        this.cursos = data;
        this.cargando = false;
        this.cdr.markForCheck();  // 👈
      },
      error: err => {
        this.cursos = [];
        this.error = err.status === 404 ? 'No hay cursos registrados.' : 'Error al cargar cursos.';
        this.cargando = false;
        this.cdr.markForCheck();  // 👈
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const payload: CursoCreate = this.form.value;
    this.mensaje = '';
    this.error = '';

    if (this.editandoId) {
      this.cursosService.updateCurso(this.editandoId, payload).subscribe({
        next: res => {
          this.mensaje = res.message || 'Curso actualizado.';
          this.resetForm();
          this.cargarCursos();
        },
        error: err => {
          this.error = err.error?.detail || 'Error al actualizar.';
          this.cdr.markForCheck();  // 👈
        }
      });
    } else {
      this.cursosService.createCurso(payload).subscribe({
        next: res => {
          this.mensaje = res.message || 'Curso registrado.';
          this.resetForm();
          this.cargarCursos();
        },
        error: err => {
          this.error = err.error?.detail || 'Error al registrar.';
          this.cdr.markForCheck();  // 👈
        }
      });
    }
  }

  editar(curso: Curso): void {
    this.editandoId = curso.id_curso;
    this.mensaje = '';
    this.error = '';
    this.form.patchValue({ nombre: curso.nombre_curso });
    this.cdr.markForCheck();  // 👈
  }

  eliminar(id: string): void {
    if (!confirm('¿Estás seguro de eliminar este curso?')) return;
    this.cursosService.deleteCurso(id).subscribe({
      next: res => {
        this.mensaje = res.message;
        this.error = '';
        this.cargarCursos();
      },
      error: err => {
        this.error = err.error?.detail || 'Error al eliminar.';
        this.cdr.markForCheck();  // 👈
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