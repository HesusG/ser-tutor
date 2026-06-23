/* ============================================================
   Caso 2 — "Acoso entre pares"
   Una estudiante revela que la excluyen y se burlan de ella (también
   en redes). Ramifica en la acogida (n1) y en la protección (n3).
   ============================================================ */
window.BRUJULA_CASES = window.BRUJULA_CASES || {};
window.BRUJULA_CASES.acoso = {
  id: "acoso",
  title: "Acoso entre pares",
  tagline: "Una revelación que pide protección",
  competency: "Acogida · validación · protección · cooperación",
  student: "Valeria",
  bg: "pasillo",
  start: "intro",
  nodes: {
    intro: {
      speaker: "student2", expression: "asustada", bg: "pasillo", name: "Valeria",
      line: "Profe… ¿puedo hablar con usted? Es que… ya no quiero venir a la escuela.",
      next: "n1"
    },

    /* --- Ramificación 1: cómo recibes la revelación --- */
    n1: {
      speaker: "student2", expression: "asustada", name: "Valeria",
      line: "En el salón se burlan de mí y me sacaron de un grupo. Subieron una foto mía para reírse.",
      prompt: "Te confía algo difícil. ¿Cómo lo recibes?",
      competency: "Acogida y escucha — UNESCO: creer al estudiante",
      choices: [
        { type: "Asertiva", text: "Gracias por contarme, hiciste bien. Aquí estás segura; vamos a ver juntas qué hacer.",
          delta: { clarity: 12, respect: 15, bond: 16 },
          title: "Acoges y das seguridad", ground: "unesco-violencia",
          feedback: "Creer y proteger es lo primero: reduce el daño y abre la puerta a que siga hablando.",
          next: "n2_open" },
        { type: "Pasiva", text: "Ay, no les hagas caso. Son cosas de niños, ya se les pasa.",
          delta: { clarity: -14, respect: -6, bond: -10 },
          title: "Minimizas el acoso", ground: "sep-convivencia",
          feedback: "'Son cosas de niños' invisibiliza el acoso. El marco de convivencia pide atenderlo, no normalizarlo.",
          next: "n2_recover" },
        { type: "Agresiva", text: "¿Quiénes fueron? Dame nombres ahorita mismo y vas a ver.",
          delta: { clarity: 6, respect: -12, bond: -14 },
          title: "Reaccionas con furia", ground: "casel-selfmgmt",
          feedback: "Tu enojo puede asustarla y hacerla retractarse. Primero contención, luego los hechos.",
          next: "n2_recover" },
        { type: "Evasiva", text: "Eso mejor arréglalo tú con ellos, no te dejes.",
          delta: { clarity: -10, respect: -8, bond: -14 },
          title: "Le devuelves el problema", ground: "sep-convivencia",
          feedback: "Pedirle a la víctima que se defienda sola ignora el desequilibrio de poder del acoso.",
          next: "n2_recover" }
      ]
    },

    n2_open: {
      speaker: "student2", expression: "triste", name: "Valeria",
      line: "Llevo semanas así. A veces lloro en el baño para que nadie me vea.",
      prompt: "Se abrió más. ¿Cómo validas y evalúas la situación?",
      competency: "Validación y valoración — SEP: convivencia",
      choices: [
        { type: "Asertiva", text: "Lo que vives duele y no es tu culpa. Cuéntame desde cuándo pasa y quiénes están.",
          delta: { clarity: 13, respect: 14, bond: 12 },
          title: "Validas y valoras el riesgo", ground: "casel-social-aware",
          feedback: "Nombras la emoción, quitas la culpa y reúnes datos para actuar con el protocolo.",
          next: "n3" },
        { type: "Pasiva", text: "Pobrecita… ya, ya, no llores, todo va a estar bien.",
          delta: { clarity: -10, respect: 6, bond: 4 },
          title: "Consuelas, pero no avanzas", ground: "bisquerra-asertividad",
          feedback: "El consuelo ayuda, pero sin valorar la situación no hay protección concreta.",
          next: "n3" },
        { type: "Agresiva", text: "Pues si no te defiendes, esto va a seguir. Tienes que ser más fuerte.",
          delta: { clarity: 4, respect: -14, bond: -12 },
          title: "Cargas la responsabilidad en ella", ground: "unesco-violencia",
          feedback: "Exigirle 'ser fuerte' culpa a la víctima y minimiza la responsabilidad institucional.",
          next: "n3" }
      ]
    },

    n2_recover: {
      speaker: "student2", expression: "asustada", name: "Valeria",
      line: "No debí decir nada… ahora va a ser peor. Mejor olvídelo.",
      prompt: "Se cerró y se arrepiente de hablar. ¿Cómo recuperas su confianza?",
      competency: "Reparación del vínculo — CASEL: conciencia social",
      choices: [
        { type: "Asertiva", text: "Perdón, empecé mal. Sí te creo y me importa. Vamos despacio: ¿qué fue lo que pasó?",
          delta: { clarity: 11, respect: 14, bond: 16 },
          title: "Reparas y reabres", ground: "casel-social-aware",
          feedback: "Reconocer tu error y reafirmar que le crees restablece la seguridad para seguir.",
          next: "n3" },
        { type: "Pasiva", text: "Bueno, si no quieres hablar, no te obligo… cuando quieras.",
          delta: { clarity: -8, respect: 4, bond: -2 },
          title: "Te retiras demasiado", ground: "bisquerra-asertividad",
          feedback: "Respetar su ritmo es válido, pero soltar del todo la deja sola con el acoso.",
          next: "n3" },
        { type: "Agresiva", text: "Ah, ¿ahora resulta? Decídete, no me hagas perder el tiempo.",
          delta: { clarity: 3, respect: -16, bond: -18 },
          title: "La castigas por dudar", ground: "casel-selfmgmt",
          feedback: "Reprocharle confirma su miedo a no ser tomada en serio. Se pierde la oportunidad.",
          next: "n3" }
      ]
    },

    /* --- Ramificación 2: proteger sin exponerla --- */
    n3: {
      speaker: "student2", expression: "asustada", name: "Valeria",
      line: "Pero no le diga a nadie, por favor. Si se enteran que hablé, va a ser peor.",
      prompt: "Teme represalias si actúas. ¿Cómo proteges?",
      competency: "Protección y protocolo — SEP: convivencia",
      choices: [
        { type: "Asertiva", text: "No puedo prometer guardarlo en secreto porque mi trabajo es protegerte; sí te prometo que nada se hace sin avisarte y cuidando tu seguridad.",
          delta: { clarity: 16, respect: 13, bond: 10 },
          title: "Activas protección con transparencia", ground: "sep-convivencia",
          feedback: "Sostienes el protocolo sin traicionar la confianza: le explicas el límite del secreto y la incluyes.",
          next: "n4_plan" },
        { type: "Pasiva", text: "Está bien, no le digo a nadie. Queda entre nosotras.",
          delta: { clarity: -16, respect: 6, bond: 4 },
          title: "Prometes un secreto que no puedes cumplir", ground: "etica-limite-rol",
          feedback: "Prometer silencio ante un riesgo te ata las manos y puede dejarla sin protección real.",
          next: "n4_drift" },
        { type: "Agresiva", text: "Esto se acaba hoy. Voy ahora mismo al salón a ponerlos en su lugar.",
          delta: { clarity: 7, respect: -10, bond: -12 },
          title: "Actúas sin cuidarla", ground: "unesco-violencia",
          feedback: "Exponerla con una intervención pública puede aumentar las represalias que ella teme.",
          next: "n4_drift" },
        { type: "Evasiva", text: "Mira, esto le toca a orientación. Ahí déjalo y que ellos vean.",
          delta: { clarity: -8, respect: -4, bond: -12 },
          title: "Derivas y te desentiendes", ground: "etica-limite-rol",
          feedback: "Canalizar es correcto, pero soltarla sin acompañarla rompe el vínculo que apenas construiste.",
          next: "n4_drift" }
      ]
    },

    n4_plan: {
      speaker: "student2", expression: "neutral", name: "Valeria",
      line: "¿Y ahora qué va a pasar? Tengo miedo de que se pongan peor.",
      prompt: "Confía en avanzar. ¿Cómo cierras con un plan?",
      competency: "Cooperación y seguimiento — SEP / UNESCO",
      choices: [
        { type: "Asertiva", text: "Hagamos esto: hoy reporto con orientación siguiendo el protocolo, acordamos a quién acudir si pasa algo, y mañana te busco para ver cómo sigues.",
          delta: { clarity: 15, respect: 12, bond: 14 },
          title: "Plan de protección y seguimiento", ground: "sep-convivencia",
          feedback: "Combinas protocolo, red de apoyo y seguimiento concreto: protección real, no solo intención.",
          next: "end" },
        { type: "Pasiva", text: "Tú tranquila, seguro ya no pasa nada. Cualquier cosa me dices.",
          delta: { clarity: -12, respect: 5, bond: -2 },
          title: "Cierras sin plan", ground: "bisquerra-asertividad",
          feedback: "Confiar en que 'ya no pasa nada' deja la protección al azar y sin responsables.",
          next: "end" },
        { type: "Agresiva", text: "Ya te dije que yo lo arreglo. No te metas más en esto.",
          delta: { clarity: 5, respect: -12, bond: -13 },
          title: "La excluyes de su propio caso", ground: "casel-social-aware",
          feedback: "Quitarle toda agencia, aun con buena intención, la deja sin voz en lo que le afecta.",
          next: "end" }
      ]
    },

    n4_drift: {
      speaker: "student2", expression: "triste", name: "Valeria",
      line: "¿Y ahora qué? Siento que todo va a empeorar por mi culpa.",
      prompt: "Quedó desprotegida y arrepentida. ¿Cómo cierras sin abandonarla?",
      competency: "Cooperación y seguimiento — SEP / UNESCO",
      choices: [
        { type: "Asertiva", text: "No te equivocaste al hablar. Déjame acompañarte: vamos juntas con orientación ahora y yo me quedo contigo.",
          delta: { clarity: 12, respect: 13, bond: 13 },
          title: "Rescatas la protección", ground: "sep-canalizacion",
          feedback: "Aunque el tramo previo falló, reafirmas que hizo bien y la acompañas a la ruta de apoyo.",
          next: "end" },
        { type: "Pasiva", text: "Bueno… si tú lo dices, lo dejamos así por ahora.",
          delta: { clarity: -13, respect: 3, bond: -8 },
          title: "Cedes y la dejas sola", ground: "etica-limite-rol",
          feedback: "Dejarlo 'así' ante un riesgo activo incumple el deber de protección del centro.",
          next: "end" },
        { type: "Agresiva", text: "Pues si no quieres ayuda, ya ni modo. Yo cumplí.",
          delta: { clarity: 4, respect: -12, bond: -15 },
          title: "Cierras la puerta", ground: "casel-selfmgmt",
          feedback: "Terminar con reproche la deja sin red y sella su idea de que no vale la pena pedir ayuda.",
          next: "end" }
      ]
    },

    end: { end: true, speaker: "narrator" }
  }
};
