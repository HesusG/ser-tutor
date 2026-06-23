# Esquema de un caso — Brújula Social RPG

Cada caso es un objeto registrado en `window.BRUJULA_CASES[<id>]`. El motor
(`engine.js`) recorre un grafo de **nodos** empezando por `start` y siguiendo el
campo `next` (en nodos de narración) o `choice.next` (en nodos de decisión) hasta
llegar a un nodo terminal (`end: true`).

Todo es **determinista y local**: no hay red, no hay LLM. Mismo recorrido → mismo
resultado, siempre.

## Objeto caso

```js
window.BRUJULA_CASES.calificacion = {
  id: "calificacion",
  title: "Calificación injusta",        // título corto (pantalla de selección)
  tagline: "Un reclamo que escala",     // subtítulo
  competency: "Comunicación · respeto · asertividad · cooperación",
  student: "Mateo",                     // nombre del estudiante (NPC)
  bg: "aula",                           // fondo por defecto del caso
  start: "intro",                       // id del primer nodo
  nodes: { /* id -> nodo */ }
};
```

## Nodo de narración / diálogo (sin decisión)

```js
intro: {
  speaker: "student",        // "student" | "tutor" | "narrator"
  expression: "enojado",     // clave de sprite/expresión (ver manifest de imágenes)
  bg: "aula",                // opcional; hereda el bg del caso si falta
  name: "Mateo",             // etiqueta del hablante en la caja de diálogo
  line: "Profe, usted siempre me baja puntos…",
  next: "n1"                 // siguiente nodo
}
```

## Nodo de decisión

```js
n1: {
  speaker: "student",
  expression: "enojado",
  name: "Mateo",
  line: "…",                       // lo último que dice el NPC antes de elegir
  prompt: "¿Qué haces primero?",   // la pregunta al tutor (jugador)
  competency: "Comunicación receptiva (CASEL: conciencia social)",
  choices: [
    {
      type: "Asertiva",            // "Asertiva" | "Pasiva" | "Agresiva" | "Evasiva"
      text: "Te escucho. Dime qué parte te parece injusta y lo revisamos.",
      delta: { clarity: 12, respect: 14, bond: 14 },  // -25..25 por eje
      title: "Abres la conversación",
      feedback: "Practicas escucha activa y das un cauce concreto…",
      ground: "casel-rel",         // clave de cita (ver fundamentos.md / GROUNDS)
      next: "n2a"                  // ramificación real
    }
    // 3–4 opciones; en nodos clave, 4 (incluye Evasiva)
  ]
}
```

## Nodo terminal

```js
end: {
  end: true,
  speaker: "narrator",
  // El motor calcula el resultado a partir de las métricas acumuladas
  // (claridad/respeto/vínculo) y la mayoría de estilos elegidos.
  // Opcional: override de texto por nodo terminal.
  result: {
    // si se omite, usa la lógica genérica de engine.js
  }
}
```

## Tipos de estilo y métricas

- **Estilos**: `Asertiva` (meta), `Pasiva` (evita/cede), `Agresiva` (impone),
  `Evasiva` (desvía/manipula). La mayoría determina el "perfil" del cierre.
- **Métricas** (0–100, arrancan en 50): `clarity` (claridad para expresar criterio),
  `respect` (respeto por la persona), `bond` (vínculo / disposición a cooperar).

## Citas (`ground`)

Cada `ground` es una clave hacia `window.BRUJULA_GROUNDS` (ver `grounds.js`), que
mapea a una referencia real verificada contra el corpus Chroma. El panel
"Fundamento" del resultado lista las citas acumuladas en el recorrido.
