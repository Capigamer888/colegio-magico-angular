import { HttpErrorResponse } from '@angular/common/http';

// Traduce un error HTTP a un mensaje entendible para el usuario.
// Así cada componente no tiene que repetir este "if" de códigos de estado.
export function mensajeDeError(err: HttpErrorResponse): string {
  if (err.status === 0) {
    return 'No hay conexión con el backend. ¿Está corriendo en el puerto 8080?';
  }
  if (err.status === 404) {
    return 'No encontrado (404).';
  }
  if (err.status === 400) {
    // El backend devuelve en el body el mensaje de la Exception lanzada por el Manager.
    return typeof err.error === 'string' && err.error ? err.error : 'Petición inválida (400).';
  }
  return `Error inesperado (${err.status}).`;
}
