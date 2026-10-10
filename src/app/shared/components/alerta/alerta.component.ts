import { Component, input } from '@angular/core';

// COMPONENTE DE PRESENTACIÓN ("tonto"): no llama a la API ni conoce servicios.
// Solo recibe datos por input() y los pinta. Se reutiliza en todas las pantallas.
@Component({
  selector: 'app-alerta',
  template: `
    @if (mensaje()) {
      <div class="alerta" [class.error]="tipo() === 'error'" [class.ok]="tipo() === 'ok'">
        {{ mensaje() }}
      </div>
    }
  `,
  styles: `
    .alerta { padding: 0.75rem 1rem; border-radius: 8px; margin: 1rem 0; border: 1px solid; }
    .ok { color: var(--ok); background: #e8f6ee; border-color: #b6e0c6; }
    .error { color: var(--error); background: #fdecea; border-color: #f3c0bb; }
  `,
})
export class Alerta {
  // input() = dato que el componente PADRE le pasa: <app-alerta [mensaje]="..." tipo="error" />
  mensaje = input<string>('');
  tipo = input<'ok' | 'error'>('ok');
}
