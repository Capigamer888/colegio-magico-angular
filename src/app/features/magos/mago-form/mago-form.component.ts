import { Component, OnInit, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MagoApiService } from '../../../core/services/mago-api.service';
import { mensajeDeError } from '../../../core/services/error-http';
import { CASAS, Mago } from '../../../models/mago.model';
import { Alerta } from '../../../shared/components/alerta/alerta.component';

// UN SOLO formulario para CREAR (POST) y EDITAR (PUT).
// Si la URL trae :id → modo edición. Si no → modo creación.
@Component({
  selector: 'app-mago-form',
  imports: [ReactiveFormsModule, RouterLink, Alerta],
  templateUrl: './mago-form.component.html',
})
export class MagoForm implements OnInit {
  private readonly magoApi = inject(MagoApiService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  id = input<string>(); // undefined en /magos/nuevo
  casas = CASAS;
  error = signal('');
  guardando = signal(false);

  // FORMULARIO REACTIVO: la estructura y las validaciones viven en TypeScript.
  // Validators.required = validación en el FRONT (mejor experiencia de usuario).
  // ¡Pero la regla REAL está en MagoManagerImpl! El front se puede saltar (Swagger, Postman…).
  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    casa: ['Gryffindor'],
  });

  get esEdicion(): boolean {
    return !!this.id();
  }

  ngOnInit(): void {
    if (this.esEdicion) {
      // Cargamos el mago actual para llenar el formulario.
      this.magoApi.obtenerPorId(Number(this.id())).subscribe({
        next: (m) => this.form.patchValue(m),
        error: (err: HttpErrorResponse) => this.error.set(mensajeDeError(err)),
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set('');

    const mago: Mago = this.form.getRawValue(); // { nombre, casa } → se envía como JSON
    const peticion = this.esEdicion
      ? this.magoApi.actualizar(Number(this.id()), mago) // PUT
      : this.magoApi.crear(mago);                         // POST

    peticion.subscribe({
      next: () => this.router.navigate(['/magos']),       // 201 / 200 → volvemos a la lista
      error: (err: HttpErrorResponse) => {                // 400 → mostramos el mensaje del Manager
        this.error.set(mensajeDeError(err));
        this.guardando.set(false);
      },
    });
  }
}
