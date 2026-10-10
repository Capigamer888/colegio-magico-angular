const fs = require('fs');
const path = require('path');

// Cada reto con prueba tiene un reporte en reportes-retos/retoN.json (lo genera `npm run retos`).
const RETOS = [
    {
        title: "Reto 1: El Pergamino del Hechizo (Modelo) 📜",
        body: "¡Bienvenido al Frontend del Colegio Mágico!\n\nAntes de pedirle hechizos al backend, el frontend necesita saber **qué forma** tienen.\n\n**Misión:**\n1. Ve a `src/app/models/hechizo.model.ts`.\n2. Completa la interfaz `Hechizo` con `nombre` (string), `tipoMagia` (string) y `nivelPoder` (number). El `id` ya está y es opcional.\n3. Llena `TIPOS_MAGIA` con: `Fuego`, `Agua`, `Tierra`, `Aire`, `Oscura` (en ese orden).\n4. Prueba en local con `npm run retos -- 1`.\n5. Haz `git add`, `git commit` y `git push`.\n\n¡Estaremos evaluando tu magia automáticamente! ✨",
        report: "reto1.json",
        hint: "💡 **Comparativa con el backend:** la interfaz es el espejo de `HechizoEntity.java`. Los nombres deben ser idénticos a los atributos Java (`tipoMagia`, no `tipo_magia`), porque Jackson los convierte a JSON tal cual. Mira `mago.model.ts` como ejemplo."
    },
    {
        title: "Reto 2: El Ojo que Todo lo Busca (GET) 🔍",
        body: "¡Excelente! El frontend ya conoce la forma de un hechizo.\n\nAhora debe **consultarlos** al backend.\n\n**Misión:**\n1. Ve a `src/app/core/services/hechizo-api.service.ts`.\n2. Implementa `buscarPorTipo(tipo)` para que haga `GET /api/hechizos?tipo=<tipo>` y devuelva el `Observable<Hechizo[]>`.\n3. Usa `HttpParams` para enviar el parámetro `tipo`.\n4. Prueba con `npm run retos -- 2`, luego commit y push.",
        report: "reto2.json",
        hint: "💡 **Comparativa con el backend:** del otro lado está `@GET` + `@QueryParam(\"tipo\")`. En Angular: `const params = new HttpParams().set('tipo', tipo); return this.http.get<Hechizo[]>(this.url, { params });`"
    },
    {
        title: "Reto 3: El Escriba del Grimorio (POST) ✍️",
        body: "¡Muy bien! Ya podemos leer el grimorio. Ahora vamos a **escribir** en él.\n\n**Misión:**\n1. En `hechizo-api.service.ts` implementa `crear(hechizo)` para que haga `POST /api/hechizos` enviando el hechizo en el cuerpo.\n2. ⚠️ El backend responde **texto** (`\"Hechizo creado correctamente\"`), no JSON. Configura la petición para recibir texto.\n3. Prueba con `npm run retos -- 3`, luego commit y push.",
        report: "reto3.json",
        hint: "💡 **Pista:** mira `MagoApiService.crear()`. Sin `{ responseType: 'text' }` Angular intenta hacer `JSON.parse(\"Hechizo creado correctamente\")` y reporta un error aunque el hechizo sí se guardó."
    },
    {
        title: "Reto 4: Los Pasillos del Castillo (Rutas) 🏰",
        body: "¡El servicio está listo! Pero nadie puede llegar a las pantallas de hechizos todavía.\n\n**Misión:**\n1. Ve a `src/app/app.routes.ts`.\n2. Agrega la ruta `'hechizos'` → `HechizoBuscador` y la ruta `'hechizos/nuevo'` → `HechizoForm` (impórtalos arriba).\n3. Deben quedar **antes** del comodín `'**'`.\n4. Prueba con `npm run retos -- 4` y abre el menú \"Grimorio\" con `npm start`. Luego commit y push.",
        report: "reto4.json",
        hint: "💡 **Comparativa con el backend:** es como `@Path(\"/hechizos\")`, pero en vez de devolver JSON, la ruta muestra un componente. El Router usa la PRIMERA ruta que coincide: si `'**'` va antes, se traga todo."
    },
    {
        title: "Reto 5: El Grimorio Viviente (Componente) 📖",
        body: "¡Ya hay camino hacia el grimorio! Ahora hay que darle vida.\n\n**Misión:** en `src/app/features/hechizos/hechizo-buscador/`:\n1. **5.1** En el constructor, usa `effect()` para que cada vez que cambie `tipo()` (y tenga valor) se llame a `buscar(tipo)`.\n2. **5.2** Implementa `buscar(tipo)`: consume `buscarPorTipo` con `subscribe({ next, error })` y actualiza las señales `hechizos`, `buscando` y `error`.\n3. **5.3** En el HTML, pinta una `<tr>` por hechizo (id, nombre, tipoMagia, nivelPoder) con `@for`, y con `@empty` una fila con el texto `No hay hechizos de {{ tipo() }}.`\n4. Prueba con `npm run retos -- 5`, luego commit y push.",
        report: "reto5.json",
        hint: "💡 **Pista:** `features/magos/mago-list` hace casi lo mismo con `ngOnInit`. Aquí usamos `effect()` porque el tipo puede cambiar sin salir de la pantalla: `effect(() => { const t = this.tipo(); if (t) this.buscar(t); });`"
    },
    {
        title: "Reto 6: El Ritual de Registro (Formulario) 🕯️",
        body: "¡Último reto de código!\n\n**Misión:** en `src/app/features/hechizos/hechizo-form/hechizo-form.component.ts`:\n1. **6.1** Agrega las validaciones: `nombre` obligatorio; `nivelPoder` obligatorio, mínimo 1 y máximo 100.\n2. **6.2** Implementa `guardar()`: si el formulario es inválido no llames a la API; si es válido usa `crear()`. Al tener éxito navega con `this.router.navigate(['/hechizos'], { queryParams: { tipo: hechizo.tipoMagia } })`. Si hay error, guarda `mensajeDeError(err)` en la señal `error`.\n3. Prueba registrando un hechizo de magia **Oscura**: debes ver el mensaje del Manager del backend.\n4. `npm run retos -- 6`, commit y push.",
        report: "reto6.json",
        hint: "💡 **Recuerda:** validar en el front mejora la experiencia, pero la regla real vive en `HechizoManagerImpl` (por eso NO bloqueamos \"Oscura\" en el front). Mira `features/magos/mago-form` como ejemplo."
    },
    {
        title: "Reto 7: Graduación Frontend 🎓 (Pull Request Final)",
        body: "🎉 **¡FELICIDADES GRAN MAGO DE FRONTEND!** 🎉\n\nHas conectado Angular con la API de Spring Boot: modelos, servicios, rutas, componentes y formularios.\n\n**Misión Final:**\n1. Crea una nueva rama: `git checkout -b graduacion-frontend`.\n2. Copia `PLANTILLA_ENTREGA.md` dentro de `magos_graduados/` con tu nombre (ej: `magos_graduados/JUAN_PEREZ.md`) y responde las preguntas.\n3. `git add .`, `git commit -m \"feat: graduacion frontend completada\"` y `git push origin graduacion-frontend`.\n4. Abre un **Pull Request** hacia el repositorio original del colegio.\n\n**--CALIFICACION_AQUI--**",
        report: null
    }
];

const INDICE_GRADUACION = RETOS.length - 1;
const MARCA_FALLO = '❌ **El Tribunal ha detectado fallas';

function retoAprobado(reto) {
    const ruta = path.join('reportes-retos', reto.report);
    if (!fs.existsSync(ruta)) return false;
    try {
        return JSON.parse(fs.readFileSync(ruta, 'utf8')).aprobado === true;
    } catch {
        return false;
    }
}

async function contarFallos(github, owner, repo, issueNumber) {
    const { data: comentarios } = await github.rest.issues.listComments({ owner, repo, issue_number: issueNumber, per_page: 100 });
    return comentarios.filter(c => c.body.includes(MARCA_FALLO)).length;
}

async function calificacionFinal(github, owner, repo) {
    let puntajeTotal = 0;
    const { data: todos } = await github.rest.issues.listForRepo({ owner, repo, state: 'all', creator: 'github-actions[bot]', per_page: 100 });
    for (let i = 0; i < INDICE_GRADUACION; i++) {
        const issue = todos.find(iss => iss.title.startsWith(`Reto ${i + 1}:`));
        if (issue) {
            const fallos = await contarFallos(github, owner, repo, issue.number);
            puntajeTotal += Math.max(2, 10 - (2 * fallos));
        } else {
            puntajeTotal += 10; // Reto superado al primer intento (sin issue propio)
        }
    }
    const maximo = INDICE_GRADUACION * 10;
    const nota = (puntajeTotal / maximo) * 5.0;
    return `### 🏆 Tu Calificación Final\n\n**Puntuación Total:** ${puntajeTotal}/${maximo}\n**Nota Final:** ${nota.toFixed(1)}`;
}

async function abrirReto(github, owner, repo, indice, encabezado = '') {
    const reto = RETOS[indice];
    let body = encabezado + reto.body;
    if (indice === INDICE_GRADUACION) {
        body = body.replace('**--CALIFICACION_AQUI--**', await calificacionFinal(github, owner, repo));
    }
    await github.rest.issues.create({ owner, repo, title: reto.title, body });
}

module.exports = async ({ github, context }) => {
    const owner = context.repo.owner;
    const repo = context.repo.repo;

    console.log('Consultando el Tribunal Mágico (Frontend)...');

    const { data: issues } = await github.rest.issues.listForRepo({
        owner, repo, state: 'open', creator: 'github-actions[bot]'
    });
    const abiertos = issues.filter(issue => issue.title.startsWith('Reto'));

    // Primera ejecución: no hay retos abiertos ni cerrados.
    if (abiertos.length === 0) {
        const { data: cerrados } = await github.rest.issues.listForRepo({ owner, repo, state: 'closed', creator: 'github-actions[bot]' });
        if (cerrados.length > 0) {
            console.log('Todos los retos completados o no hay issues activos.');
            return;
        }
        console.log('Inicio de aventura. Evaluando Reto 1.');
        if (retoAprobado(RETOS[0])) {
            await abrirReto(github, owner, repo, 1, '✅ **¡Has despertado al Tribunal Mágico y tu Modelo está perfecto!**\n\n---\n\n');
        } else {
            await abrirReto(github, owner, repo, 0, '❌ **¡Has despertado al Tribunal, pero el Modelo aún no está listo!**\n\n---\n\n');
        }
        return;
    }

    const actual = abiertos[0];
    const match = actual.title.match(/Reto (\d+)/);
    if (!match) return;

    const indice = parseInt(match[1]) - 1;
    const reto = RETOS[indice];
    console.log(`Evaluando el ${reto.title}...`);

    if (indice === INDICE_GRADUACION) {
        console.log('Esperando graduación manual (Pull Request).');
        return;
    }

    const fallos = await contarFallos(github, owner, repo, actual.number);

    if (retoAprobado(reto)) {
        console.log('¡Hechizo exitoso!');
        const puntos = Math.max(2, 10 - (2 * fallos));
        const nota = (puntos / 10) * 5.0;

        await github.rest.issues.createComment({
            owner, repo, issue_number: actual.number,
            body: `✅ **¡Hechizo superado!**\n\nEl Tribunal Mágico ha verificado tu código y funciona perfectamente.\n\n⭐ **Puntos obtenidos en este reto:** ${puntos}/10 (Nota: ${nota.toFixed(1)})\n\nVoy a cerrar este reto y abriré el siguiente.`
        });
        await github.rest.issues.update({ owner, repo, issue_number: actual.number, state: 'closed' });
        await abrirReto(github, owner, repo, indice + 1);
    } else {
        console.log('El hechizo falló.');
        const pista = fallos >= 1 && reto.hint ? `\n\n${reto.hint}` : '';
        await github.rest.issues.createComment({
            owner, repo, issue_number: actual.number,
            body: `${MARCA_FALLO} en tu hechizo.**\n\nAsegúrate de haber completado el código correctamente y de que pase las pruebas locales con \`npm run retos -- ${indice + 1}\` antes de volver a hacer push.${pista}\n\n¡No te rindas, sigue practicando! 🪄`
        });
    }
};
