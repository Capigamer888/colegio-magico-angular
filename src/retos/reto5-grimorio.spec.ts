// ⚠️ ARCHIVO DEL TRIBUNAL MÁGICO: NO LO MODIFIQUES.
// Reto 5: El Grimorio Viviente (componente que consume la API)
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { HechizoBuscador } from '../app/features/hechizos/hechizo-buscador/hechizo-buscador.component';

describe('Reto 5: HechizoBuscador', () => {
  let fixture: ComponentFixture<HechizoBuscador>;
  let http: HttpTestingController;
  const html = () => fixture.nativeElement as HTMLElement;

  async function cambiarTipo(tipo: string) {
    fixture.componentRef.setInput('tipo', tipo);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  async function refrescar() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HechizoBuscador],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(HechizoBuscador);
  });

  it('cuando llega ?tipo=Fuego consulta GET /api/hechizos?tipo=Fuego', async () => {
    await cambiarTipo('Fuego');
    http.expectOne((r) => r.urlWithParams === '/api/hechizos?tipo=Fuego').flush([]);
  });

  it('pinta una fila <tr> por cada hechizo con su nombre y su nivel de poder', async () => {
    await cambiarTipo('Fuego');
    http.expectOne((r) => r.urlWithParams === '/api/hechizos?tipo=Fuego').flush([
      { id: 1, nombre: 'Incendio', tipoMagia: 'Fuego', nivelPoder: 40 },
      { id: 2, nombre: 'Lumos', tipoMagia: 'Fuego', nivelPoder: 5 },
    ]);
    await refrescar();
    const filas = html().querySelectorAll('tbody tr');
    expect(filas.length).toBe(2);
    expect(filas[0].textContent).toContain('Incendio');
    expect(filas[0].textContent).toContain('40');
    expect(filas[1].textContent).toContain('Lumos');
  });

  it('si no hay resultados muestra "No hay hechizos de Fuego"', async () => {
    await cambiarTipo('Fuego');
    http.expectOne((r) => r.urlWithParams === '/api/hechizos?tipo=Fuego').flush([]);
    await refrescar();
    expect(html().textContent).toContain('No hay hechizos de Fuego');
  });

  it('al cambiar el tipo vuelve a consultar la API', async () => {
    await cambiarTipo('Fuego');
    http.expectOne((r) => r.urlWithParams === '/api/hechizos?tipo=Fuego').flush([]);
    await cambiarTipo('Agua');
    http.expectOne((r) => r.urlWithParams === '/api/hechizos?tipo=Agua').flush([]);
  });
});
