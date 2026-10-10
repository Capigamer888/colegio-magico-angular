import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { MagoApiService } from '../../../core/services/mago-api.service';
import { mensajeDeError } from '../../../core/services/error-http';
import { Mago } from '../../../models/mago.model';
import { Alerta } from '../../../shared/components/alerta/alerta.component';
import { MagoCard } from '../../../shared/components/mago-card/mago-card.component';

// COMPONENTE "INTELIGENTE" (contenedor / página):
// - Pide los datos al servicio.
// - Guarda el estado de la pantalla (lista, cargando, mensajes).
// - Delega el "pintar" a componentes de presentación (MagoCard, Alerta).
@Component({
  selector: 'app-mago-list',
  imports: [RouterLink, MagoCard, Alerta],
  templateUrl: './mago-list.component.html',
})
export class MagoList implements OnInit {
  private readonly magoApi = inject(MagoApiService);

  // signal() = variable "reactiva": cuando cambia, Angular actualiza el HTML solo.
  magos = signal<Mago[]>([]);
  cargando = signal(true);
  error = signal('');
  exito = signal('');

  // ngOnInit se ejecuta UNA vez cuando el componente aparece en pantalla.
  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    // Las peticiones HTTP son ASÍNCRONAS: devuelven un Observable y no pasa nada
    // hasta que alguien hace subscribe().
    this.magoApi.listar().subscribe({
      next: (lista) => {            // 200 OK
        this.magos.set(lista);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(mensajeDeError(err));
        this.cargando.set(false);
      },
    });
  }

  eliminar(mago: Mago): void {
    if (!confirm(`¿Expulsar a ${mago.nombre} del colegio?`)) return;
    this.magoApi.eliminar(mago.id!).subscribe({
      next: () => {                 // 204 No Content
        this.exito.set(`${mago.nombre} fue eliminado.`);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.error.set(mensajeDeError(err)),
    });
  }
}
