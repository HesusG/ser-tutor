/* ============================================================
   Caso 1 — "Calificación injusta"
   Árbol ramificado: ramifica en n1 (apertura) y n3 (límite).
   Rework del caso lineal original de brujula-social.html.
   ============================================================ */
window.BRUJULA_CASES = window.BRUJULA_CASES || {};
window.BRUJULA_CASES.calificacion = {
  id: "calificacion",
  title: "Calificación injusta",
  tagline: "Un reclamo que escala a amenaza",
  competency: "Escucha · respeto · asertividad · cooperación",
  student: "Mateo",
  bg: "aula",
  start: "intro",
  nodes: {
    intro: {
      speaker: "student", expression: "enojado", bg: "aula", name: "Mateo",
      line: "Profe, usted siempre me baja puntos. No se vale. Mejor ya no hago nada.",
      next: "n1"
    },

    /* --- Punto de ramificación 1: cómo abres --- */
    n1: {
      speaker: "student", expression: "enojado", name: "Mateo",
      line: "Llegué directo a reclamarle. Usted dirá.",
      prompt: "El estudiante llega alterado. ¿Qué haces primero?",
      competency: "Comunicación receptiva — CASEL: conciencia social",
      choices: [
        { type: "Asertiva", text: "Te escucho. Dime qué parte de la calificación te parece injusta y lo revisamos con calma.",
          delta: { clarity: 12, respect: 14, bond: 14 },
          title: "Abres la conversación", ground: "casel-social-aware",
          feedback: "Practicas escucha y das un cauce concreto sin prometer cambiar la nota. El estudiante baja la guardia.",
          next: "n2_open" },
        { type: "Pasiva", text: "Bueno, no pasa nada. Si quieres lo vemos otro día.",
          delta: { clarity: -12, respect: 6, bond: 4 },
          title: "Bajas el conflicto, pero evitas el fondo", ground: "bisquerra-asertividad",
          feedback: "Cuidas el tono, pero dejas el reclamo sin atender y el criterio académico queda difuso.",
          next: "n2_recover" },
        { type: "Agresiva", text: "No me hables así. Con esa actitud pierdes tu oportunidad.",
          delta: { clarity: 8, respect: -18, bond: -16 },
          title: "Hay control, pero se rompe la escucha", ground: "casel-selfmgmt",
          feedback: "La regla queda clara, pero castigas la emoción antes de comprender el mensaje.",
          next: "n2_recover" },
        { type: "Evasiva", text: "Ahorita ando ocupado. Eso lo ve con coordinación, ¿no?",
          delta: { clarity: -8, respect: -6, bond: -10 },
          title: "Esquivas el problema", ground: "casel-rel",
          feedback: "Derivar de entrada le dice al estudiante que su asunto no importa. El vínculo se enfría.",
          next: "n2_recover" }
      ]
    },

    /* Rama A: abriste bien */
    n2_open: {
      speaker: "student", expression: "triste", name: "Mateo",
      line: "Es que sí estudié. Siento que no cuenta nada de lo que hago.",
      prompt: "Reconoció su esfuerzo. ¿Cómo validas su emoción sin darle automáticamente la razón?",
      competency: "Respeto por los demás — SEP: relación con los demás",
      choices: [
        { type: "Asertiva", text: "Entiendo que te frustre sentir que tu esfuerzo no se ve. Revisemos juntos qué evidencia hay.",
          delta: { clarity: 12, respect: 15, bond: 12 },
          title: "Validas sin rendir el criterio", ground: "sep-relacion",
          feedback: "Distingues emoción y hecho: reconoces la vivencia y llevas el diálogo a evidencia revisable.",
          next: "n3" },
        { type: "Pasiva", text: "Sí, tienes razón, quizá fui demasiado exigente contigo.",
          delta: { clarity: -14, respect: 8, bond: 7 },
          title: "Validas, pero cedes el criterio", ground: "bisquerra-asertividad",
          feedback: "Reconocer la emoción no exige asumir culpa sin revisar la evidencia.",
          next: "n3" },
        { type: "Agresiva", text: "Eso no es cierto. Aquí todos se evalúan igual.",
          delta: { clarity: 6, respect: -14, bond: -12 },
          title: "Defiendes la norma, pero niegas la experiencia", ground: "casel-social-aware",
          feedback: "La regla puede ser igual, pero la frase bloquea comprender lo que vive el estudiante.",
          next: "n3" }
      ]
    },

    /* Rama B: arrancaste en falso, hay que recuperar */
    n2_recover: {
      speaker: "student", expression: "enojado", name: "Mateo",
      line: "Ah, ya ve. Ni siquiera me escucha. Para qué vengo.",
      prompt: "Arrancaste en falso y se cerró. ¿Cómo recuperas la conversación?",
      competency: "Reparación del vínculo — CASEL: autorregulación",
      choices: [
        { type: "Asertiva", text: "Tienes razón, te corté. Empecemos otra vez: cuéntame qué te pareció injusto.",
          delta: { clarity: 10, respect: 14, bond: 16 },
          title: "Reparas y reabres", ground: "casel-selfmgmt",
          feedback: "Reconocer el propio error y reabrir es autorregulación: modela lo que esperas del estudiante.",
          next: "n3" },
        { type: "Pasiva", text: "No te enojes… ándale, a ver, dime.",
          delta: { clarity: -8, respect: 4, bond: 5 },
          title: "Suavizas, pero sin rumbo", ground: "bisquerra-asertividad",
          feedback: "Calmas el momento, pero sin un cauce claro la charla puede volver a descarrilar.",
          next: "n3" },
        { type: "Agresiva", text: "Si vas a venir con esa cara, mejor ni hablamos.",
          delta: { clarity: 4, respect: -16, bond: -18 },
          title: "Doblas la apuesta", ground: "casel-selfmgmt",
          feedback: "Responder al cierre con más cierre confirma al estudiante que aquí no será escuchado.",
          next: "n3" }
      ]
    },

    /* --- Punto de ramificación 2: el límite ante la amenaza --- */
    n3: {
      speaker: "student", expression: "enojado", name: "Mateo",
      line: "Entonces cámbieme la nota. Si no, voy a decir que usted me trae mala voluntad.",
      prompt: "Sube el tono y amenaza. ¿Qué límite expresas?",
      competency: "Comunicación expresiva y asertividad — Bisquerra",
      choices: [
        { type: "Asertiva", text: "Puedo revisar la evidencia contigo; no puedo cambiar una nota por presión o amenaza.",
          delta: { clarity: 16, respect: 12, bond: 8 },
          title: "Límite claro y respetuoso", ground: "bisquerra-asertividad",
          feedback: "Defiendes el criterio sin atacar a la persona. Eso es asertividad: claridad con respeto.",
          next: "n4_plan" },
        { type: "Pasiva", text: "Está bien, te subo algunos puntos para que no haya problema.",
          delta: { clarity: -18, respect: 4, bond: -6 },
          title: "Evitas la presión, pero pierdes la justicia", ground: "casel-responsible",
          feedback: "Ceder ante la amenaza enseña que la presión decide más que la evidencia.",
          next: "n4_drift" },
        { type: "Agresiva", text: "Haz lo que quieras. Con amenazas no consigues nada conmigo.",
          delta: { clarity: 9, respect: -16, bond: -14 },
          title: "El límite aparece como confrontación", ground: "casel-selfmgmt",
          feedback: "Hay límite, pero el tono vuelve la conversación una lucha de poder.",
          next: "n4_drift" },
        { type: "Evasiva", text: "Mira, mejor habla con tus papás y que ellos vengan.",
          delta: { clarity: -10, respect: -4, bond: -12 },
          title: "Escurres la responsabilidad", ground: "casel-rel",
          feedback: "Trasladar el problema sin sostener el límite tú mismo deja al estudiante sin referente.",
          next: "n4_drift" }
      ]
    },

    /* Cierre tras un buen límite */
    n4_plan: {
      speaker: "student", expression: "neutral", name: "Mateo",
      line: "Entonces, ¿qué hago? Ya no sé ni por dónde empezar.",
      prompt: "Se abrió a cooperar. ¿Cómo cierras la conversación?",
      competency: "Cooperación y solución de conflictos — SEP / OCDE",
      choices: [
        { type: "Asertiva", text: "Hagamos esto: revisamos la rúbrica ahora, eliges una evidencia para mejorar y acordamos fecha de entrega.",
          delta: { clarity: 15, respect: 12, bond: 14 },
          title: "Conviertes el conflicto en plan", ground: "ocde-sel",
          feedback: "La salida combina criterio, participación del estudiante y un acuerdo verificable.",
          next: "end" },
        { type: "Pasiva", text: "Tú piensa qué quieres hacer y luego me avisas.",
          delta: { clarity: -10, respect: 4, bond: -3 },
          title: "Das libertad, pero poco acompañamiento", ground: "sep-relacion",
          feedback: "El estudiante queda solo ante el problema. Falta una acción concreta para avanzar.",
          next: "end" },
        { type: "Agresiva", text: "Pues ponte al corriente. Las indicaciones estaban desde el inicio.",
          delta: { clarity: 5, respect: -13, bond: -14 },
          title: "Cierras rápido, pero sin cooperación", ground: "casel-responsible",
          feedback: "La indicación puede ser cierta, pero no construye una salida ni recupera disposición.",
          next: "end" }
      ]
    },

    /* Cierre tras un mal límite: hay que rescatar algo */
    n4_drift: {
      speaker: "student", expression: "triste", name: "Mateo",
      line: "Ya ni para qué. Usted hace lo que quiere de todos modos.",
      prompt: "Quedó resentido. ¿Cómo cierras sin perderlo del todo?",
      competency: "Cooperación y solución de conflictos — SEP / OCDE",
      choices: [
        { type: "Asertiva", text: "Sé que quedaste molesto. Aun así te dejo la puerta abierta: si quieres, mañana revisamos tu evidencia con calma.",
          delta: { clarity: 12, respect: 12, bond: 12 },
          title: "Rescatas el vínculo", ground: "casel-rel",
          feedback: "Aunque el tramo previo falló, ofreces un cauce concreto y sostienes la relación a futuro.",
          next: "end" },
        { type: "Pasiva", text: "Bueno… como tú veas, pues.",
          delta: { clarity: -12, respect: 3, bond: -6 },
          title: "Te rindes con él", ground: "bisquerra-asertividad",
          feedback: "Dejarlo ir confirma su idea de que no hay nada que hacer. Se pierde la oportunidad de reparar.",
          next: "end" },
        { type: "Agresiva", text: "Allá tú. Yo ya cumplí con avisarte.",
          delta: { clarity: 4, respect: -12, bond: -15 },
          title: "Cierras la puerta", ground: "casel-selfmgmt",
          feedback: "Terminar con un reproche sella el conflicto sin salida y deteriora el vínculo a futuro.",
          next: "end" }
      ]
    },

    end: { end: true, speaker: "narrator" }
  }
};
