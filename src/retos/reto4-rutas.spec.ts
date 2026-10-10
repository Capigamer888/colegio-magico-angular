// ⚠️ ARCHIVO DEL TRIBUNAL MÁGICO: NO LO MODIFIQUES.
// Reto 4: Los Pasillos del Castillo (Rutas)
import { routes } from '../app/app.routes';
import { HechizoBuscador } from '../app/features/hechizos/hechizo-buscador/hechizo-buscador.component';
import { HechizoForm } from '../app/features/hechizos/hechizo-form/hechizo-form.component';

describe('Reto 4: Rutas de hechizos', () => {
  const indice = (path: string) => routes.findIndex((r) => r.path === path);

  it("la ruta 'hechizos' muestra el componente HechizoBuscador", () => {
    expect(routes[indice('hechizos')]?.component).toBe(HechizoBuscador);
  });

  it("la ruta 'hechizos/nuevo' muestra el componente HechizoForm", () => {
    expect(routes[indice('hechizos/nuevo')]?.component).toBe(HechizoForm);
  });

  it("las rutas de hechizos van ANTES del comodín '**'", () => {
    const comodin = indice('**');
    expect(comodin).toBeGreaterThan(-1);
    expect(indice('hechizos')).toBeGreaterThan(-1);
    expect(indice('hechizos')).toBeLessThan(comodin);
    expect(indice('hechizos/nuevo')).toBeGreaterThan(-1);
    expect(indice('hechizos/nuevo')).toBeLessThan(comodin);
  });
});
