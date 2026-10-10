import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Mago } from '../../../models/mago.model';

// Otro componente de presentación: muestra UN mago.
// Comunicación:  padre → hijo con input()   |   hijo → padre con output()
@Component({
  selector: 'app-mago-card',
  imports: [RouterLink],
  template: `
    <article class="tarjeta">
      <p class="id">#{{ mago().id }}</p>
      <h3>{{ mago().nombre }}</h3>
      <p class="casa">🏠 {{ mago().casa || 'Sin casa' }}</p>
      <div class="fila">
        <a class="btn secundario" [routerLink]="['/magos', mago().id]">Ver</a>
        <a class="btn secundario" [routerLink]="['/magos', mago().id, 'editar']">Editar</a>
        <!-- (click) dispara el output: el hijo AVISA, pero quien borra es el padre -->
        <button class="btn peligro" (click)="eliminar.emit(mago())">Eliminar</button>
      </div>
    </article>
  `,
  styles: `
    h3 { margin: 0.2rem 0; }
    .id { margin: 0; color: var(--gris); font-size: 0.8rem; }
    .casa { color: var(--gris); margin: 0 0 1rem; }
  `,
})
export class MagoCard {
  mago = input.required<Mago>();
  eliminar = output<Mago>();
}
