import { Component, OnInit, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { MagoApiService } from '../../../core/services/mago-api.service';
import { mensajeDeError } from '../../../core/services/error-http';
import { Mago } from '../../../models/mago.model';
import { Alerta } from '../../../shared/components/alerta/alerta.component';

@Component({
  selector: 'app-mago-detail',
  imports: [RouterLink, Alerta],
  templateUrl: './mago-detail.component.html',
})
export class MagoDetail implements OnInit {
  private readonly magoApi = inject(MagoApiService);

  // El ":id" de la ruta 'magos/:id' llega aquí automáticamente
  // (gracias a withComponentInputBinding). Es el @PathParam("id") del frontend.
  id = input.required<string>();

  mago = signal<Mago | null>(null);
  error = signal('');

  ngOnInit(): void {
    this.magoApi.obtenerPorId(Number(this.id())).subscribe({
      next: (m) => this.mago.set(m),                                 // 200
      error: (err: HttpErrorResponse) => this.error.set(             // 404
        err.status === 404 ? `No existe un mago con id ${this.id()}.` : mensajeDeError(err),
      ),
    });
  }
}
