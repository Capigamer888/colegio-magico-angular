// ⚠️ ARCHIVO DEL TRIBUNAL MÁGICO: NO LO MODIFIQUES.
// Reto 2: El Ojo que Todo lo Busca (GET con query param)
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HechizoApiService } from '../app/core/services/hechizo-api.service';

describe('Reto 2: HechizoApiService.buscarPorTipo()', () => {
  let servicio: HechizoApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(HechizoApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('hace GET a /api/hechizos?tipo=Fuego', () => {
    servicio.buscarPorTipo('Fuego').subscribe();
    const req = http.expectOne((r) => r.urlWithParams === '/api/hechizos?tipo=Fuego');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('devuelve la lista de hechizos que responde el backend', () => {
    let resultado: unknown;
    servicio.buscarPorTipo('Agua').subscribe((lista) => (resultado = lista));
    const lista = [{ id: 1, nombre: 'Aguamenti', tipoMagia: 'Agua', nivelPoder: 10 }];
    http.expectOne((r) => r.urlWithParams === '/api/hechizos?tipo=Agua').flush(lista);
    expect(resultado).toEqual(lista);
  });
});
