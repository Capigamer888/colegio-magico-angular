// ⚠️ ARCHIVO DEL TRIBUNAL MÁGICO: NO LO MODIFIQUES.
// Reto 1: El Pergamino del Hechizo (Modelo)
import { Hechizo, TIPOS_MAGIA } from '../app/models/hechizo.model';

describe('Reto 1: Modelo Hechizo', () => {
  it('la interfaz Hechizo tiene nombre (string), tipoMagia (string) y nivelPoder (number)', () => {
    // Si la interfaz no tiene estos campos, este archivo ni siquiera compila.
    const hechizo: Hechizo = { nombre: 'Incendio', tipoMagia: 'Fuego', nivelPoder: 40 };
    expect(hechizo.nombre).toBe('Incendio');
    expect(hechizo.tipoMagia).toBe('Fuego');
    expect(hechizo.nivelPoder).toBe(40);
  });

  it('el id es opcional (al crear, lo asigna la base de datos)', () => {
    const nuevo: Hechizo = { nombre: 'Aguamenti', tipoMagia: 'Agua', nivelPoder: 10 };
    const guardado: Hechizo = { ...nuevo, id: 7 };
    expect(nuevo.id).toBeUndefined();
    expect(guardado.id).toBe(7);
  });

  it('TIPOS_MAGIA contiene exactamente Fuego, Agua, Tierra, Aire y Oscura (en ese orden)', () => {
    expect(TIPOS_MAGIA).toEqual(['Fuego', 'Agua', 'Tierra', 'Aire', 'Oscura']);
  });
});
