# Pedagogía del Bien Común — sitio informativo (rediseño)

**Fecha:** 2026-07-04
**Archivo objetivo:** `docs/bien-comun/index.html`
**Referencia estética:** https://www.academias.dev/es/ (humanist-editorial minimal)

## Problema

La versión de Codex documenta *el plan* de un sitio en lugar de *ser* el sitio.
El envoltorio meta debe eliminarse; el contenido real (bueno) se conserva y se eleva a
calidad Awwwards en registro editorial minimalista.

## Objetivo

Una página única, informativa, andragógica, que **es** el sitio: entrega directa de los
cuatro apartados obligatorios del trabajo, sin lenguaje de "plan". Es una **entrega
académica** que debe leerse como sitio terminado.

## Decisiones de diseño (cerradas)

- **Dirección:** clean editorial minimal, calcado del registro de academias.dev.
- **Paleta:** papel hueso (~`#faf8f4`/`#ffffff`), tinta (~`#161514`), **un solo acento teal**
  (~`#0e6b6b`), grises de línea. Se **retira** el sistema de tarjetas rojo/teal/azul/ocre.
- **Tipografía:** stack **sans del sistema** (grotesk); títulos bold, cuerpo regular.
  Sin fuentes web (debe verse bien offline / al calificar en local).
- **Interactividad:** solo el **widget del caso Carmen/Gael** (3 rutas → panel de
  consecuencias). Todo lo demás es scroll tranquilo + fades sutiles.
- **Fotos fuente:** ambas se conservan, **rectas** (sin rotación), monocromo/duotono,
  con leyenda estilo `FIG.` como evidencia de las fuentes.
- **Técnica:** un **único HTML autocontenido** (CSS/JS inline, sin depender de `book.css`),
  conservando el `pager` de regreso y el `footer` para pertenecer a *Ser tutor*.

## Firmas visuales importadas de academias.dev

- Etiquetas de sección numeradas en monoespaciada: `[01]`–`[04]`.
- Imágenes con leyenda `FIG.` (nuestras fotos, en monocromo/duotono).
- Botones tipo enlace de texto con flecha `→` (nav y botones de ruta del caso).
- Énfasis en itálica con saltos de línea intencionales en el hero.
- Reglas horizontales de pelo entre secciones.
- Medida centrada ~1000px, mucho aire.

## Estructura (un scroll)

Nav superior delgada con anclas.

1. **Hero** — tesis del sitio + pregunta de entrada:
   *"¿Qué haces cuando ayudar a un estudiante parece chocar con ser justo con todos?"*
   (con énfasis en itálica y saltos de línea). Sin "plan", sin "Entrar al plan".
2. **[01] Hallazgos** — qué significa la Pedagogía del Bien Común: lede, 4 pilares
   (Integralidad · Alteridad · Don · Amor) diferenciados por número/tipografía (no color),
   la tríada *desde / por / para el bien común*. `FIG.` foto UPAEP (monocromo).
3. **[02] Ética y comunidad de cuestionamiento** — ética vs. moral (Droit), cita-rostro de
   Lévinas, **caso Carmen/Gael con widget de rutas** (se conserva y limpia el JS), las 4
   preguntas de la comunidad de cuestionamiento. `FIG.` foto del caso (monocromo).
4. **[03] La institución** — vinculación con IES mexicanas, tabla
   área/aplicación/pregunta-ética, presencial/híbrido/MOOC.
5. **[04] Referencias** — mapa de lectura por grupos + lista numerada con enlaces.
6. **Cierre** — aprendizaje central (se conserva; es fuerte).

## Eliminaciones explícitas

- Sección `#delphi` (Wideband Delphi) completa.
- Etiquetas "Sección obligatoria N" → reemplazadas por `[0N]` + título real.
- Frases meta: "un plan de contenido", "Entrar al plan", "Antes de diseñar la web",
  "La web debe…", "La sección final de la web debe mostrar…", "laboratorio ético del sitio".
- Sistema multicolor de tarjetas y artefactos rotados con sombra dura.

## Accesibilidad y robustez

- Semántica de encabezados correcta; `aria` del widget conservado/mejorado.
- `prefers-reduced-motion`: sin fades.
- Autocontenido: abre bien por `file://`, sin dependencias externas ni fuentes web.
- Se conservan los `id` de ancla existentes donde aplique.

## Fuera de alcance (YAGNI)

- Índice lateral pegajoso, contadores animados, glosario hover, modo oscuro.
- Cambios a otras páginas del sitio salvo el enlace/estado que ya existe hacia bien-común.
