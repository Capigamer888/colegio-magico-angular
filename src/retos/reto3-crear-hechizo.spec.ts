// ⚠️ ARCHIVO DEL TRIBUNAL MÁGICO: NO LO MODIFIQUES.
// Reto 3: El Escriba del Grimorio (POST que responde texto)
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HechizoApiService } from '../app/core/services/hechizo-api.service';

describe('Reto 3: HechizoApiService.crear()', () => {
  let servicio: HechizoApiService;
  let http: HttpTestingController;
  const hechizo = { nombre: 'Incendio', tipoMagia: 'Fuego', nivelPoder: 40 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(HechizoApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('hace POST a /api/hechizos enviando el hechizo en el cuerpo', () => {
    servicio.crear(hechizo).subscribe();
    const req = http.expectOne('/api/hechizos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(hechizo);
    req.flush('Hechizo creado correctamente', { status: 201, statusText: 'Created' });
  });

  it("usa responseType: 'text' porque el backend responde texto plano", () => {
    let respuesta: unknown;
    servicio.crear(hechizo).subscribe((r) => (respuesta = r));
    const req = http.expectOne('/api/hechizos');
    expect(req.request.responseType).toBe('text');
    req.flush('Hechizo creado correctamente', { status: 201, statusText: 'Created' });
    expect(respuesta).toBe('Hechizo creado correctamente');
  });

  it('deja pasar el error 400 con el mensaje del Manager', () => {
    let error: HttpErrorResponse | undefined;
    servicio.crear({ ...hechizo, tipoMagia: 'Oscura' }).subscribe({ error: (e) => (error = e) });
    http
      .expectOne('/api/hechizos')
      .flush('Magia prohibida en el colegio', { status: 400, statusText: 'Bad Request' });
    expect(error?.status).toBe(400);
    expect(error?.error).toBe('Magia prohibida en el colegio');
  });
});
