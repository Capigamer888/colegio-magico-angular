import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  template: `
    <h1>Portal del Colegio Mágico</h1>
    <p class="subtitulo">Frontend en Angular que consume la API de Spring Boot (puerto 8080).</p>
    <div class="grilla">
      <a class="tarjeta enlace" routerLink="/magos">
        <h3>🧙 Magos</h3>
        <p>CRUD completo: GET, POST, PUT y DELETE sobre <code>/api/magos</code>.</p>
      </a>
      <a class="tarjeta enlace" routerLink="/hechizos">
        <h3>📖 Grimorio</h3>
        <p>Buscar por tipo (<code>?tipo=</code>) y registrar hechizos en <code>/api/hechizos</code>.</p>
      </a>
    </div>
  `,
  styles: `
    .enlace { color: inherit; text-decoration: none; transition: border-color .15s; }
    .enlace:hover { border-color: var(--primario); }
  `,
})
export class Inicio {}
