// 🧙 EL TRIBUNAL MÁGICO (local y en GitHub Actions)
// Ejecuta las pruebas de cada reto POR SEPARADO y guarda el resultado en reportes-retos/retoN.json.
// Así, si un reto no compila, los demás se evalúan igual.
//
// Uso:  npm run retos          → evalúa todos
//       npm run retos -- 3     → evalúa solo el reto 3
import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ngBin = require.resolve('@angular/cli/bin/ng.js');

const CARPETA_PRUEBAS = 'src/retos';
const CARPETA_REPORTES = 'reportes-retos';
mkdirSync(CARPETA_REPORTES, { recursive: true });

const soloReto = process.argv[2] ? Number(process.argv[2]) : null;
const pruebas = readdirSync(CARPETA_PRUEBAS)
  .filter((f) => /^reto\d+-.*\.spec\.ts$/.test(f))
  .map((f) => ({ archivo: f, numero: Number(f.match(/^reto(\d+)/)[1]) }))
  .filter((p) => soloReto === null || p.numero === soloReto)
  .sort((a, b) => a.numero - b.numero);

const resultados = [];
for (const prueba of pruebas) {
  const ruta = `${CARPETA_PRUEBAS}/${prueba.archivo}`;
  // tsconfig temporal que SOLO incluye la prueba de este reto: así un error de tipos
  // en otro reto (por ejemplo, el modelo sin terminar) no tumba la evaluación de este.
  const tsconfigReto = join(CARPETA_REPORTES, `tsconfig.reto${prueba.numero}.json`);
  writeFileSync(
    tsconfigReto,
    JSON.stringify({ extends: '../tsconfig.spec.json', include: ['../src/**/*.d.ts', `../${ruta}`] }, null, 2),
  );
  process.stdout.write(`\n🔮 Evaluando Reto ${prueba.numero} (${ruta})...\n`);
  const ejecucion = spawnSync(
    process.execPath,
    [ngBin, 'test', '--watch=false', '--include', ruta, '--ts-config', tsconfigReto],
    { encoding: 'utf8', env: { ...process.env, NG_CLI_ANALYTICS: 'false', CI: 'true' } },
  );
  const salida = `${ejecucion.stdout ?? ''}\n${ejecucion.stderr ?? ''}`;
  const aprobado = ejecucion.status === 0;
  resultados.push({ reto: prueba.numero, aprobado });
  writeFileSync(
    join(CARPETA_REPORTES, `reto${prueba.numero}.json`),
    JSON.stringify({ reto: prueba.numero, archivo: ruta, aprobado, fecha: new Date().toISOString() }, null, 2),
  );
  // Mostramos la salida solo si falló, para que el estudiante vea qué prueba no pasó.
  if (!aprobado) console.log(salida.split('\n').slice(-60).join('\n'));
  console.log(aprobado ? `✅ Reto ${prueba.numero} superado` : `❌ Reto ${prueba.numero} pendiente`);
}

console.log('\n📜 Veredicto del Tribunal');
console.table(resultados.map((r) => ({ Reto: r.reto, Estado: r.aprobado ? '✅ superado' : '❌ pendiente' })));
// Siempre terminamos en 0 (como -Dmaven.test.failure.ignore=true) para que el workflow pueda comentar.
