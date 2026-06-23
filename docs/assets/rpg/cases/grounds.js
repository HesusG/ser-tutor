/* ============================================================
   Brújula Social RPG — registro de fundamentos (citas)
   Cada clave se referencia desde los nodos (choice.ground) y se
   muestra en el panel "Fundamento" del resultado.

   Corpus de referencia (libro de la profesora), verificado vía índice
   Chroma local (OCR del PDF) — ver refs/grounding/fundamentos.md:
     Bisquerra, R. (coord.) y otros. "10 Ideas Clave. Educación
     Emocional." Graó.  (las páginas citadas son del PDF)

   verified:true  -> respaldado por un pasaje localizado en ese libro.
   verified:false -> marco externo reconocible (CASEL, SEP, UNESCO,
                     OCDE) o protocolo institucional, aún sin contraste
                     contra una fuente oficial descargada localmente.
   ============================================================ */
window.BRUJULA_GROUNDS = {
  "casel-rel": {
    marco: "Bisquerra · Idea Clave 3",
    label: "Competencia social (habilidades de relación)",
    cita: "Las competencias sociales son «la capacidad para mantener buenas relaciones con otras personas»: comunicación receptiva y expresiva, respeto, asertividad. (Bisquerra, 10 Ideas Clave, p.63-65; cf. CASEL: relationship skills)",
    verified: true
  },
  "casel-social-aware": {
    marco: "Bisquerra · conciencia",
    label: "Conciencia social y empatía",
    cita: "Implica «tomar conciencia de la interacción entre emoción» y captar las claves verbales y no verbales de los demás antes de responder. (Bisquerra, 10 Ideas Clave, p.57; cf. CASEL: conciencia social)",
    verified: true
  },
  "casel-selfmgmt": {
    marco: "Bisquerra · Idea Clave 9",
    label: "Regulación emocional",
    cita: "«La ira mal regulada es causa de muchos comportamientos violentos»; regular la ira es estrategia eficaz de prevención: responder, no reaccionar. (Bisquerra, 10 Ideas Clave, p.161-163; cf. CASEL: autorregulación)",
    verified: true
  },
  "casel-responsible": {
    marco: "Bisquerra · competencias para la vida",
    label: "Toma de decisiones responsable",
    cita: "«Desarrollar mecanismos personales para tomar decisiones» justas en lo personal, académico y social, considerando el bienestar. (Bisquerra, 10 Ideas Clave, p.66; cf. CASEL: decisiones responsables)",
    verified: true
  },
  "sep-autorregulacion": {
    marco: "Bisquerra · regulación",
    label: "Autorregulación",
    cita: "Regular la intensidad y duración de los estados emocionales para sostener el diálogo (estrategias de afrontamiento). (Bisquerra, 10 Ideas Clave, p.60; cf. SEP Construye T: Autorregulación)",
    verified: true
  },
  "sep-relacion": {
    marco: "Bisquerra · Idea Clave 3",
    label: "Relación con los demás",
    cita: "Mantener buenas relaciones supone dominar habilidades sociales básicas, comunicación y asertividad. (Bisquerra, 10 Ideas Clave, p.63-65; cf. SEP Construye T: Relación con los demás)",
    verified: true
  },
  "bisquerra-asertividad": {
    marco: "Bisquerra · Idea Clave 3",
    label: "Asertividad",
    cita: "La asertividad —expresar con claridad lo que se piensa, siente y necesita sin vulnerar al otro— es microcompetencia de la competencia social. (Bisquerra, 10 Ideas Clave, p.63-65; programa p.146, ítem 7)",
    verified: true
  },
  "ocde-sel": {
    marco: "Bisquerra · bienestar",
    label: "Competencias para la vida y el bienestar",
    cita: "Las competencias para la vida «permiten organizar nuestra vida de forma sana y equilibrada», facilitando bienestar. (Bisquerra, 10 Ideas Clave, p.53, p.66; cf. OCDE: Social and Emotional Skills)",
    verified: true
  },
  "sep-convivencia": {
    marco: "Bisquerra · Idea Clave 9",
    label: "Convivencia y prevención de la violencia",
    cita: "La regulación de la ira previene la violencia; el acoso implica también a los observadores y a toda la clase, no se minimiza. (Bisquerra, 10 Ideas Clave, p.162, p.166; cf. SEP: marco de convivencia)",
    verified: true
  },
  "unesco-violencia": {
    marco: "UNESCO",
    label: "Violencia y acoso escolar",
    cita: "UNESCO — «Detrás de los números: poner fin a la violencia y el acoso escolares»: creer al estudiante y garantizar su seguridad reduce el daño.",
    verified: false
  },
  "sep-canalizacion": {
    marco: "SEP · protocolo",
    label: "Canalización / derivación",
    cita: "SEP (México) — Protocolos de atención: ante señales de riesgo emocional, activar la ruta de canalización a apoyo especializado.",
    verified: false
  },
  "etica-limite-rol": {
    marco: "Ética profesional (Cap. 6)",
    label: "Límite del rol",
    cita: "El tutor acompaña y deriva; no sustituye al especialista. Sostener el vínculo sin exceder la competencia profesional.",
    verified: false
  },
  "casel-self-aware": {
    marco: "Bisquerra · conciencia emocional",
    label: "Conciencia emocional",
    cita: "El componente cognitivo de la emoción permite «tomar conciencia de la emoción y ponerle nombre» —primer paso de la regulación. (Bisquerra, 10 Ideas Clave, p.40, p.57; cf. CASEL: autoconciencia)",
    verified: true
  }
};

/* ============================================================
   Referencias para seguir aprendiendo (en español, fuentes
   reconocibles). Se muestran en el resultado bajo "Para seguir".
   ⚠️ Verificar enlaces/edición exacta contra Chroma en Fase 0.
   ============================================================ */
window.BRUJULA_REFS = {
  general: [
    { org: "Bisquerra, R. (coord.)", title: "10 Ideas Clave. Educación Emocional",
      year: "Graó", url: "https://www.rafaelbisquerra.com/educacion-emocional/",
      note: "Referencia base de la actividad: las cinco competencias emocionales (conciencia, regulación, autonomía, competencia social y competencias para la vida y el bienestar)." },
    { org: "UNESCO", title: "Replantear la educación: ¿Hacia un bien común mundial?",
      year: "2015", url: "https://unesdoc.unesco.org/ark:/48223/pf0000232697",
      note: "El aprendizaje como acompañamiento humanista, no solo académico." },
    { org: "CASEL", title: "Marco de las cinco competencias del aprendizaje socioemocional (SEL)",
      year: "2020", url: "https://casel.org/fundamentals-of-sel/",
      note: "Autoconciencia, autorregulación, conciencia social, habilidades de relación y decisiones responsables." },
    { org: "SEP México · Construye T", title: "Habilidades socioemocionales en la escuela",
      year: "2018", url: "https://www.construye-t.org.mx/",
      note: "Marco oficial mexicano de educación socioemocional (Conoce T, Relaciona T, Elige T)." },
    { org: "Bisquerra, R. (GROP)", title: "Educación emocional y bienestar",
      year: "2009", url: "https://www.rafaelbisquerra.com/educacion-emocional/",
      note: "Competencias emocionales: conciencia, regulación, autonomía, competencia social y para la vida." }
  ],
  acoso: [
    { org: "UNESCO", title: "Detrás de los números: poner fin a la violencia y el acoso escolares",
      year: "2019", url: "https://unesdoc.unesco.org/ark:/48223/pf0000366483",
      note: "Datos y rutas de actuación ante el acoso entre pares." },
    { org: "SEP México", title: "Marco para la convivencia escolar / PNCE",
      year: "2019", url: "https://www.gob.mx/sep",
      note: "Protocolos de prevención y atención de la violencia en la escuela." }
  ],
  crisis: [
    { org: "UNESCO", title: "Salud mental y bienestar de estudiantes (caja de herramientas)",
      year: "2022", url: "https://healtheducationresources.unesco.org/",
      note: "Acompañamiento del bienestar emocional y rutas de derivación." },
    { org: "SEP México", title: "Protocolos de atención y canalización en educación básica/media",
      year: "2021", url: "https://www.gob.mx/sep",
      note: "Cuándo y cómo activar la ruta a apoyo especializado." }
  ]
};
