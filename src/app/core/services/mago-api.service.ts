import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Mago } from '../../models/mago.model';

// SERVICIO DE ACCESO A LA API
// Es el "DAO del frontend": su ÚNICA responsabilidad es hablar con el backend.
// Los componentes NO usan HttpClient directamente; siempre pasan por aquí.
//
// ⚠️ No confundir con la carpeta "services" del backend (allá son los endpoints / controllers).
//
// @Injectable({ providedIn: 'root' }) = Angular crea UNA sola instancia para toda la app
// y la inyecta donde se pida. Es el equivalente a @Service / @Repository + @Autowired en Spring.
@Injectable({ providedIn: 'root' })
export class MagoApiService {
  // inject() es el "@Autowired" de Angular.
  private readonly http = inject(HttpClient);

  // Ruta RELATIVA: el proxy (proxy.conf.json) la redirige a http://localhost:8080/api/magos
  private readonly url = '/api/magos';

  // GET /api/magos  →  MagoService.obtenerTodosLosMagos()  →  200 + lista JSON
  listar(): Observable<Mago[]> {
    return this.http.get<Mago[]>(this.url);
  }

  // GET /api/magos/{id}  →  @PathParam("id")  →  200 o 404
  obtenerPorId(id: number): Observable<Mago> {
    return this.http.get<Mago>(`${this.url}/${id}`);
  }

  // POST /api/magos  →  201 "Mago creado con éxito"  o  400 con el mensaje del Manager
  // responseType: 'text' porque el backend responde un TEXTO, no un JSON.
  // Sin esto, Angular intenta hacer JSON.parse("Mago creado con éxito") y lanza error.
  crear(mago: Mago): Observable<string> {
    return this.http.post(this.url, mago, { responseType: 'text' });
  }

  // PUT /api/magos/{id}  →  200 "Mago actualizado correctamente"  o  400
  actualizar(id: number, mago: Mago): Observable<string> {
    return this.http.put(`${this.url}/${id}`, mago, { responseType: 'text' });
  }

  // DELETE /api/magos/{id}  →  204 No Content  o  404
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
