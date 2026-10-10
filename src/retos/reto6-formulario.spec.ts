// ⚠️ ARCHIVO DEL TRIBUNAL MÁGICO: NO LO MODIFIQUES.
// Reto 6: El Ritual de Registro (formulario + POST + manejo de errores)
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { HechizoForm } from '../app/features/hechizos/hechizo-form/hechizo-form.component';

describe('Reto 6: HechizoForm', () => {
  let fixture: ComponentFixture<HechizoForm>;
  let componente: HechizoForm;
  let http: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HechizoForm],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(HechizoForm);
    componente = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('el nombre es obligatorio', () => {
    componente.form.controls.nombre.setValue('');
    expect(componente.form.controls.nombre.valid).toBe(false);
    componente.form.controls.nombre.setValue('Expelliarmus');
    expect(componente.form.controls.nombre.valid).toBe(true);
  });

  it('el nivel de poder debe estar entre 1 y 100', () => {
    const poder = componente.form.controls.nivelPoder;
    poder.setValue(0);
    expect(poder.valid).toBe(false);
    poder.setValue(101);
    expect(poder.valid).toBe(false);
    poder.setValue(50);
    expect(poder.valid).toBe(true);
  });

  it('con el formulario inválido, guardar() NO llama a la API', () => {
    componente.form.controls.nombre.setValue('');
    componente.guardar();
    http.expectNone('/api/hechizos');
  });

  it('con el formulario válido hace POST y luego navega a /hechizos?tipo=<tipo>', () => {
    componente.form.setValue({ nombre: 'Incendio', tipoMagia: 'Fuego', nivelPoder: 40 });
    componente.guardar();
    const req = http.expectOne('/api/hechizos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ nombre: 'Incendio', tipoMagia: 'Fuego', nivelPoder: 40 });
    req.flush('Hechizo creado correctamente', { status: 201, statusText: 'Created' });
    expect(router.navigate).toHaveBeenCalledWith(['/hechizos'], { queryParams: { tipo: 'Fuego' } });
  });

  it('si el backend responde 400 muestra su mensaje en pantalla', async () => {
    componente.form.setValue({ nombre: 'Avada', tipoMagia: 'Oscura', nivelPoder: 99 });
    componente.guardar();
    http
      .expectOne('/api/hechizos')
      .flush('Magia prohibida en el colegio', { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Magia prohibida en el colegio');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
