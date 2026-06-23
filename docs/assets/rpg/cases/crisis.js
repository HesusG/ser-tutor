/* ============================================================
   Caso 3 — "Crisis emocional / ansiedad"
   Un estudiante llega desbordado por ansiedad ante los exámenes y
   expresa desánimo profundo. Modela contención + límite del rol +
   canalización acompañada. Ramifica en la contención (n1) y en la
   respuesta a la señal de riesgo (n3).
   Trato responsable: sin detalles gráficos; el tutor acompaña y deriva.
   ============================================================ */
window.BRUJULA_CASES = window.BRUJULA_CASES || {};
window.BRUJULA_CASES.crisis = {
  id: "crisis",
  title: "Crisis emocional",
  tagline: "Ansiedad que desborda y una señal de alerta",
  competency: "Contención · validación · canalización · acompañamiento",
  student: "Diego",
  bg: "oficina",
  start: "intro",
  nodes: {
    intro: {
      speaker: "student3", expression: "ansioso", bg: "oficina", name: "Diego",
      line: "Profe… no puedo. Siento que me falta el aire y mañana es el examen. Ya no quiero ni venir.",
      next: "n1"
    },

    /* --- Ramificación 1: contención del momento agudo --- */
    n1: {
      speaker: "student3", expression: "ansioso", name: "Diego",
      line: "Tengo el corazón a mil. No me sale nada, me bloqueo y siento que todo me sale mal.",
      prompt: "Llega desbordado. ¿Cuál es tu primera respuesta?",
      competency: "Contención — CASEL: autoconciencia",
      choices: [
        { type: "Asertiva", text: "Estoy aquí contigo. Respira conmigo un momento; no tienes que resolver todo ahorita. Cuéntame qué sientes.",
          delta: { clarity: 12, respect: 14, bond: 15 },
          title: "Contienes y acompañas", ground: "casel-self-aware",
          feedback: "Presencia calmada y ayudarlo a nombrar lo que siente es el primer paso de la regulación.",
          next: "n2_open" },
        { type: "Pasiva", text: "Tranquilo, no es para tanto. Es solo un examen, a todos nos pasa.",
          delta: { clarity: -12, respect: -4, bond: -10 },
          title: "Minimizas lo que siente", ground: "casel-self-aware",
          feedback: "'No es para tanto' invalida la emoción y le enseña que aquí no puede mostrarse vulnerable.",
          next: "n2_recover" },
        { type: "Agresiva", text: "Pues échale ganas. Si estudiaras en vez de estresarte, no estarías así.",
          delta: { clarity: 5, respect: -16, bond: -16 },
          title: "Exiges en plena crisis", ground: "casel-selfmgmt",
          feedback: "Reclamar esfuerzo a alguien desbordado aumenta la angustia y rompe el vínculo.",
          next: "n2_recover" },
        { type: "Evasiva", text: "Mejor pásate a tu clase y al rato vemos, ¿va?",
          delta: { clarity: -10, respect: -6, bond: -12 },
          title: "Aplazas la crisis", ground: "etica-limite-rol",
          feedback: "Mandarlo a clase en pleno bloqueo deja sin atender una señal que pedía respuesta ahora.",
          next: "n2_recover" }
      ]
    },

    n2_open: {
      speaker: "student3", expression: "neutral", name: "Diego",
      line: "(respira) Es que… son muchas cosas. En casa también está difícil y siento que ya no puedo con todo.",
      prompt: "Bajó un poco la activación. ¿Cómo sigues?",
      competency: "Validación y exploración — Bisquerra",
      choices: [
        { type: "Asertiva", text: "Gracias por confiarme esto. Tiene sentido que te sientas rebasado con tanto encima. Vamos a verlo por partes.",
          delta: { clarity: 13, respect: 14, bond: 12 },
          title: "Validas y ordenas", ground: "bisquerra-asertividad",
          feedback: "Validar sin dramatizar y proponer 'por partes' devuelve sensación de control.",
          next: "n3" },
        { type: "Pasiva", text: "Ya, ya… seguro mañana lo ves distinto. Échate un cafecito y se te baja.",
          delta: { clarity: -10, respect: 5, bond: 3 },
          title: "Restas importancia con cariño", ground: "casel-self-aware",
          feedback: "El gesto es amable, pero 'mañana se te baja' cierra la puerta a lo que necesita decir.",
          next: "n3" },
        { type: "Agresiva", text: "Bueno, pero no te me hundas. Hay gente con problemas peores.",
          delta: { clarity: 4, respect: -13, bond: -12 },
          title: "Comparas y minimizas", ground: "casel-social-aware",
          feedback: "Comparar su dolor con el de otros le enseña a callar lo que siente.",
          next: "n3" }
      ]
    },

    n2_recover: {
      speaker: "student3", expression: "ansioso", name: "Diego",
      line: "Olvídelo. Total, a nadie le importa cómo estoy. Da igual.",
      prompt: "Se cerró y se aísla. ¿Cómo reabres con seguridad?",
      competency: "Reparación y contención — CASEL: conciencia social",
      choices: [
        { type: "Asertiva", text: "A mí sí me importa, y por eso me quedo. Perdón si te presioné. Estoy aquí para escucharte, sin prisa.",
          delta: { clarity: 11, respect: 14, bond: 16 },
          title: "Reparas y te quedas", ground: "casel-social-aware",
          feedback: "Reafirmar que te importa y quedarte rompe la sensación de que no hay a quién acudir.",
          next: "n3" },
        { type: "Pasiva", text: "Bueno, si no quieres hablar, lo respeto. Ahí cuando gustes.",
          delta: { clarity: -8, respect: 5, bond: -3 },
          title: "Te retiras ante el aislamiento", ground: "bisquerra-asertividad",
          feedback: "Respetar el silencio está bien, pero en señal de aislamiento, soltar del todo es arriesgado.",
          next: "n3" },
        { type: "Agresiva", text: "No te pongas dramático. Así no se arreglan las cosas.",
          delta: { clarity: 3, respect: -16, bond: -17 },
          title: "Descalificas su malestar", ground: "casel-selfmgmt",
          feedback: "Llamar 'dramático' a alguien que se aísla confirma que mostrarse aquí no es seguro.",
          next: "n3" }
      ]
    },

    /* --- Ramificación 2: la señal de riesgo y el límite del rol --- */
    n3: {
      speaker: "student3", expression: "triste", name: "Diego",
      line: "A veces pienso que sería más fácil ya no estar. Pero no le diga a nadie, ¿eh? Es entre usted y yo.",
      prompt: "Aparece una señal de alerta y te pide secreto. ¿Qué haces?",
      competency: "Señal de riesgo y canalización — SEP / ética",
      choices: [
        { type: "Asertiva", text: "Lo que me dices es importante y me preocupa de verdad. Justo por eso no lo puedo guardar en secreto: vamos juntos ahora con quien puede ayudarte, y yo te acompaño.",
          delta: { clarity: 16, respect: 13, bond: 11 },
          title: "Tomas en serio y canalizas acompañando", ground: "sep-canalizacion",
          feedback: "Ante una señal de riesgo no se guarda secreto: se activa la ruta de apoyo y se acompaña. Ese es el rol.",
          next: "n4_plan" },
        { type: "Pasiva", text: "Está bien, queda entre nosotros. No le digo a nadie, te lo prometo.",
          delta: { clarity: -18, respect: 5, bond: 4 },
          title: "Prometes un secreto peligroso", ground: "etica-limite-rol",
          feedback: "Prometer silencio ante una señal de riesgo lo deja sin la ayuda especializada que necesita.",
          next: "n4_drift" },
        { type: "Agresiva", text: "No digas esas cosas. Eso no se dice ni de broma.",
          delta: { clarity: 4, respect: -12, bond: -14 },
          title: "Te asustas y lo cierras", ground: "casel-selfmgmt",
          feedback: "Regañar la frase corta la conversación justo cuando más necesita ser escuchado.",
          next: "n4_drift" },
        { type: "Evasiva", text: "Uy, eso ya es para el psicólogo. Ahí ve a buscarlo tú.",
          delta: { clarity: -8, respect: -4, bond: -14 },
          title: "Derivas y lo sueltas", ground: "etica-limite-rol",
          feedback: "Derivar es correcto, pero mandarlo solo y sin contención abandona el acompañamiento.",
          next: "n4_drift" }
      ]
    },

    n4_plan: {
      speaker: "student3", expression: "aliviado", name: "Diego",
      line: "(asiente) Está bien… ¿usted me acompaña? No quería decirlo en voz alta.",
      prompt: "Aceptó ayuda. ¿Cómo cierras con cuidado?",
      competency: "Acompañamiento y red de apoyo — SEP / ética",
      choices: [
        { type: "Asertiva", text: "Sí, vamos juntos ahora con orientación, avisamos a tu familia con cuidado y acordamos cómo sigo en contacto contigo esta semana.",
          delta: { clarity: 15, respect: 12, bond: 14 },
          title: "Red de apoyo y seguimiento", ground: "sep-canalizacion",
          feedback: "Acompañar a la ruta de apoyo, sumar a la familia y dar seguimiento es contención real, dentro de tu rol.",
          next: "end" },
        { type: "Pasiva", text: "Qué bueno que ya lo platicaste. Verás que se te pasa solito.",
          delta: { clarity: -14, respect: 4, bond: -4 },
          title: "Cierras sin canalizar", ground: "etica-limite-rol",
          feedback: "Confiar en que 'se le pasa solo' tras una señal de riesgo omite el paso clave: la ayuda especializada.",
          next: "end" },
        { type: "Agresiva", text: "Ya, pero esto no se lo cuentas a nadie más, ¿eh?",
          delta: { clarity: 6, respect: -10, bond: -12 },
          title: "Lo callas de nuevo", ground: "casel-social-aware",
          feedback: "Pedirle que lo oculte refuerza el estigma y aísla justo cuando necesita su red.",
          next: "end" }
      ]
    },

    n4_drift: {
      speaker: "student3", expression: "triste", name: "Diego",
      line: "Ya decía yo que mejor no hablaba. Olvídelo, profe.",
      prompt: "Quedó solo con su malestar. ¿Cómo cierras sin abandonarlo?",
      competency: "Acompañamiento y red de apoyo — SEP / ética",
      choices: [
        { type: "Asertiva", text: "No, espera. Hiciste bien en decirlo y no te voy a soltar. Vamos ahora mismo con quien puede ayudarte; te acompaño.",
          delta: { clarity: 13, respect: 13, bond: 13 },
          title: "Rescatas y canalizas", ground: "sep-canalizacion",
          feedback: "Aunque el tramo previo falló, reafirmas que hizo bien y activas la ruta de apoyo acompañándolo.",
          next: "end" },
        { type: "Pasiva", text: "Bueno… piénsalo y si quieres luego me buscas.",
          delta: { clarity: -14, respect: 3, bond: -8 },
          title: "Lo dejas ir", ground: "etica-limite-rol",
          feedback: "Dejarlo marcharse solo tras una señal de riesgo incumple el deber de cuidado del centro.",
          next: "end" },
        { type: "Agresiva", text: "Pues si no quieres ayuda, allá tú. Yo ya te escuché.",
          delta: { clarity: 4, respect: -13, bond: -16 },
          title: "Cierras la puerta", ground: "casel-selfmgmt",
          feedback: "Responder con reproche a quien se aísla puede ser exactamente lo que confirme su desesperanza.",
          next: "end" }
      ]
    },

    end: { end: true, speaker: "narrator" }
  }
};
