import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';   // 👈 importa CommonModule
import { UsuariosService, Usuario } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],   // 👈 habilita *ngFor y *ngIf
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.usuariosService.getUsuarios()
      .subscribe({
        next: data => this.usuarios = data,
        error: err => console.error('Error al cargar usuarios', err)
      });
  }
}
