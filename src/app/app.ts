import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],  // 👈 ambos son necesarios
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title = 'mi-app';
}