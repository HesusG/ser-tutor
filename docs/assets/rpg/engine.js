/* ============================================================
   Brújula Social RPG — motor de árbol de diálogo
   Vanilla JS · sin red · sin LLM · determinista.
   Recorre window.BRUJULA_CASES[id] desde `start` siguiendo
   `next` / `choice.next` hasta un nodo terminal (end:true).
   ============================================================ */
(function () {
  "use strict";

  var IMG_BASE = "assets/img/rpg/";
  // pixel 1x1 transparente: fallback que nunca muestra "imagen rota"
  var TRANSPARENT = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var el = {};
  var state = null;
  var typer = null; // intervalo del typewriter en curso

  function $(id) { return document.getElementById(id); }
  function clamp(n) { return Math.max(0, Math.min(100, Math.round(n))); }

  function cacheEls() {
    [
      "rpgSelect", "rpgCaseList", "rpgGame", "rpgResult",
      "rpgBg", "rpgSprite", "rpgSpeaker", "rpgLine",
      "rpgDecision", "rpgPrompt", "rpgChoices", "rpgFeedback",
      "rpgFbType", "rpgFbTitle", "rpgFbText", "rpgNext",
      "rpgTurn", "rpgHud",
      "clarityFill", "respectFill", "bondFill",
      "clarityScore", "respectScore", "bondScore",
      "resultBadge", "resultTitle", "resultText", "resultProfile",
      "resultSkills", "resultGrounds", "resultRefs", "rpgAgain", "rpgMenu"
    ].forEach(function (id) { el[id] = $(id); });
  }

  /* ---------- imágenes con fallback a placeholder ---------- */
  function setMedia(imgEl, kind, char, expr) {
    if (!imgEl) return;
    imgEl.classList.remove("is-loaded");
    imgEl.setAttribute("data-kind", kind);
    if (char) imgEl.setAttribute("data-char", char);
    if (expr) imgEl.setAttribute("data-expr", expr);
    var file = kind === "bg" ? ("bg-" + char) : (char + "-" + expr);
    var src = IMG_BASE + file + ".png";
    // is-loaded sólo si carga un PNG real (el pixel transparente mide 1x1)
    imgEl.onload = function () { imgEl.classList.toggle("is-loaded", imgEl.naturalWidth > 1); };
    imgEl.onerror = function () { imgEl.classList.remove("is-loaded"); imgEl.src = TRANSPARENT; };
    imgEl.src = src;
  }

  /* ---------- typewriter ---------- */
  function stopTyper() { if (typer) { clearInterval(typer); typer = null; } }

  function typeLine(text, done) {
    stopTyper();
    el.rpgLine.classList.remove("is-typing");
    if (reduceMotion) { el.rpgLine.textContent = text; if (done) done(); return; }
    el.rpgLine.textContent = "";
    el.rpgLine.classList.add("is-typing");
    var i = 0;
    typer = setInterval(function () {
      i += 1;
      el.rpgLine.textContent = text.slice(0, i);
      if (i >= text.length) {
        stopTyper();
        el.rpgLine.classList.remove("is-typing");
        if (done) done();
      }
    }, 18);
    // clic en el diálogo = saltar al texto completo
    el.rpgLine.parentNode.onclick = function () {
      if (!typer) return;
      stopTyper();
      el.rpgLine.textContent = text;
      el.rpgLine.classList.remove("is-typing");
      if (done) done();
    };
  }

  /* ---------- HUD / métricas ---------- */
  function updateMeters() {
    [["clarity", "clarityFill", "clarityScore"],
     ["respect", "respectFill", "respectScore"],
     ["bond", "bondFill", "bondScore"]].forEach(function (row) {
      var v = clamp(state[row[0]]);
      if (el[row[1]]) el[row[1]].style.transform = "scaleX(" + (v / 100) + ")";
      if (el[row[2]]) el[row[2]].textContent = v;
    });
    if (el.rpgTurn) el.rpgTurn.textContent = "Turno " + (state.decisions + 1);
  }

  /* ---------- render de un nodo ---------- */
  function renderNode(nodeId) {
    var node = state.caseObj.nodes[nodeId];
    if (!node) return;
    state.nodeId = nodeId;

    if (node.end) { showResult(); return; }

    var bg = node.bg || state.caseObj.bg;
    setMedia(el.rpgBg, "bg", bg);
    setMedia(el.rpgSprite, "sprite", node.speaker, node.expression || "neutral");
    el.rpgSprite.setAttribute("alt",
      (node.name || node.speaker) + (node.expression ? " (" + node.expression + ")" : ""));

    el.rpgSpeaker.textContent = node.name ||
      (node.speaker === "tutor" ? "Tú (tutor·a)" : node.speaker === "narrator" ? "" : "");
    el.rpgSpeaker.hidden = !el.rpgSpeaker.textContent;

    // reset decisión
    el.rpgChoices.innerHTML = "";
    el.rpgFeedback.hidden = true;
    el.rpgNext.hidden = true;
    el.rpgPrompt.textContent = "";
    el.rpgDecision.classList.remove("is-ready");
    state.picked = null;

    typeLine(node.line || "", function () {
      if (node.choices) {
        el.rpgPrompt.textContent = node.prompt || "";
        renderChoices(node);
      } else {
        // nodo de narración: botón continuar
        el.rpgNext.hidden = false;
        el.rpgNext.textContent = "Continuar ▸";
        el.rpgNext.focus();
        el.rpgNext.onclick = function () { renderNode(node.next); };
      }
      el.rpgDecision.classList.add("is-ready");
    });
    updateMeters();
  }

  function renderChoices(node) {
    node.choices.forEach(function (choice, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "rpg-choice";
      btn.setAttribute("data-type", choice.type);
      btn.innerHTML =
        '<span class="rpg-choice__k">' + (i + 1) + "</span>" +
        '<span class="rpg-choice__body">' +
          '<span class="rpg-choice__type">' + choice.type + "</span>" +
          '<span class="rpg-choice__text">' + escapeHtml(choice.text) + "</span>" +
        "</span>";
      btn.onclick = function () { pickChoice(node, i, btn); };
      el.rpgChoices.appendChild(btn);
    });
    var first = el.rpgChoices.querySelector(".rpg-choice");
    if (first) first.focus();
  }

  function pickChoice(node, i, btn) {
    if (state.picked !== null) return;
    var choice = node.choices[i];
    state.picked = choice;
    state.decisions += 1;
    state.types.push(choice.type);
    if (choice.ground) state.grounds.push(choice.ground);
    state.clarity = clamp(state.clarity + choice.delta.clarity);
    state.respect = clamp(state.respect + choice.delta.respect);
    state.bond = clamp(state.bond + choice.delta.bond);

    Array.prototype.forEach.call(el.rpgChoices.children, function (c) {
      c.disabled = true;
      c.classList.toggle("is-picked", c === btn);
    });

    el.rpgFbType.textContent = choice.type;
    el.rpgFbType.setAttribute("data-type", choice.type);
    el.rpgFbTitle.textContent = choice.title;
    el.rpgFbText.textContent = choice.feedback;
    el.rpgFeedback.hidden = false;

    el.rpgNext.hidden = false;
    el.rpgNext.textContent = node.choices[i].next === "end" ? "Ver resultado ▸" : "Continuar ▸";
    el.rpgNext.onclick = function () { renderNode(choice.next); };
    el.rpgNext.focus();

    updateMeters();
  }

  /* ---------- resultado ---------- */
  function majorityType() {
    var counts = { Asertiva: 0, Pasiva: 0, Agresiva: 0, Evasiva: 0 };
    state.types.forEach(function (t) { counts[t] = (counts[t] || 0) + 1; });
    var total = state.types.length || 1;
    if (counts.Asertiva / total >= 0.6) return "asertiva";
    var top = "mixta", max = 0;
    ["Agresiva", "Pasiva", "Evasiva", "Asertiva"].forEach(function (k) {
      if (counts[k] > max) { max = counts[k]; top = k.toLowerCase(); }
    });
    // si ningún estilo domina con claridad, es "mixta"
    var sorted = [counts.Asertiva, counts.Pasiva, counts.Agresiva, counts.Evasiva]
      .sort(function (a, b) { return b - a; });
    if (sorted[0] === sorted[1]) return "mixta";
    return top;
  }

  function showResult() {
    var avg = Math.round((state.clarity + state.respect + state.bond) / 3);
    var style = majorityType();
    var profile = { badge: "Equilibrio asertivo", title: "Respuesta socialmente competente",
      text: "Sostuviste los tres ejes: claridad para expresar criterio, respeto por la experiencia del estudiante y vínculo suficiente para construir una salida." };

    if (avg < 62 && style === "agresiva") {
      profile = { badge: "Mucho control, poco vínculo", title: "Respuesta con tendencia agresiva",
        text: "Marcaste límites, pero redujiste escucha y respeto. Falta equilibrar la comunicación expresiva con la receptiva." };
    } else if (avg < 62 && style === "pasiva") {
      profile = { badge: "Mucho cuidado, poca claridad", title: "Respuesta con tendencia pasiva",
        text: "Bajaste el conflicto inmediato, pero dejaste débiles los límites y el criterio. La asertividad cuida el vínculo sin renunciar a lo justo." };
    } else if (style === "evasiva") {
      profile = { badge: "Esquivas el conflicto", title: "Respuesta con tendencia evasiva",
        text: "Derivar o aplazar protege tu tiempo, pero deja al estudiante sin referente y sin una salida concreta." };
    } else if (avg < 70 || style === "mixta") {
      profile = { badge: "Equilibrio parcial", title: "Respuesta en construcción",
        text: "Hubo momentos competentes y momentos frágiles. Revisa cuál eje bajó más —claridad, respeto o vínculo—: ahí está la siguiente práctica." };
    }

    el.rpgGame.hidden = true;
    el.rpgResult.hidden = false;
    el.resultBadge.textContent = profile.badge;
    el.resultTitle.textContent = profile.title;
    el.resultText.textContent = profile.text;
    el.resultProfile.textContent =
      "Claridad " + clamp(state.clarity) + " · Respeto " + clamp(state.respect) +
      " · Vínculo " + clamp(state.bond) + "  ·  estilo dominante: " + style;

    renderSkills(style);
    renderGrounds();
    renderRefs();
    el.rpgResult.focus();
  }

  // Recomienda habilidades a trabajar según el eje más débil y el estilo dominante.
  function renderSkills(style) {
    if (!el.resultSkills) return;
    var AX = {
      clarity: { t: "Comunicación asertiva", d: "Expresar criterio, límites y necesidades con claridad —sin rodeos ni amenazas. (CASEL: habilidades de relación)" },
      respect: { t: "Escucha activa y validación emocional", d: "Reconocer la emoción del otro antes de corregir; separar a la persona del problema. (CASEL: conciencia social)" },
      bond:    { t: "Vínculo y cooperación", d: "Cerrar con acuerdos concretos y acompañamiento que sostengan la relación. (SEP: relación con los demás)" }
    };
    var ST = {
      agresiva: { t: "Autorregulación emocional", d: "Regular tu propia activación para responder, no reaccionar. (CASEL: autorregulación)" },
      pasiva:   { t: "Asertividad ante la presión", d: "Sostener lo justo sin ceder por evitar el conflicto. (Bisquerra: competencia social)" },
      evasiva:  { t: "Afrontamiento y acompañamiento", d: "No derivar ni aplazar sin contener y dar seguimiento. (Ética del rol tutor)" },
      mixta:    { t: "Consistencia del estilo asertivo", d: "Aplicar claridad-con-respeto de forma sostenida en todos los tramos, no solo en algunos." },
      asertiva: { t: "Consolidar y modelar", d: "Tu estilo asertivo es la meta; ahora ayuda al estudiante a desarrollar el suyo." }
    };
    // eje más débil
    var axes = [["clarity", state.clarity], ["respect", state.respect], ["bond", state.bond]]
      .sort(function (a, b) { return a[1] - b[1]; });
    var picks = [], seen = {};
    function add(o) { if (o && !seen[o.t]) { seen[o.t] = true; picks.push(o); } }
    add(AX[axes[0][0]]);
    add(ST[style]);
    if (picks.length < 2) add(AX[axes[1][0]]);

    el.resultSkills.innerHTML = "";
    picks.forEach(function (p) {
      var li = document.createElement("li");
      li.className = "rpg-skill";
      li.innerHTML = '<strong>' + escapeHtml(p.t) + "</strong><span>" + escapeHtml(p.d) + "</span>";
      el.resultSkills.appendChild(li);
    });
  }

  function renderRefs() {
    if (!el.resultRefs) return;
    var R = window.BRUJULA_REFS || {};
    var list = (R.general || []).concat(R[state.caseId] || []);
    el.resultRefs.innerHTML = "";
    list.forEach(function (r) {
      var li = document.createElement("li");
      li.className = "rpg-ref";
      var titleHtml = r.url
        ? '<a href="' + escapeHtml(r.url) + '" target="_blank" rel="noopener">' + escapeHtml(r.title) + "</a>"
        : escapeHtml(r.title);
      li.innerHTML =
        '<span class="rpg-ref__org">' + escapeHtml(r.org) + (r.year ? " · " + escapeHtml(r.year) : "") + "</span>" +
        '<span class="rpg-ref__title">' + titleHtml + "</span>" +
        (r.note ? '<span class="rpg-ref__note">' + escapeHtml(r.note) + "</span>" : "");
      el.resultRefs.appendChild(li);
    });
  }

  function renderGrounds() {
    if (!el.resultGrounds) return;
    el.resultGrounds.innerHTML = "";
    var G = window.BRUJULA_GROUNDS || {};
    var seen = {};
    state.grounds.forEach(function (key) {
      if (seen[key] || !G[key]) return;
      seen[key] = true;
      var g = G[key];
      var li = document.createElement("li");
      li.className = "rpg-ground" + (g.verified ? "" : " is-provisional");
      li.innerHTML =
        '<span class="rpg-ground__marco">' + escapeHtml(g.marco) + "</span>" +
        '<span class="rpg-ground__cita">' + escapeHtml(g.cita) + "</span>";
      el.resultGrounds.appendChild(li);
    });
    if (!el.resultGrounds.children.length) {
      el.resultGrounds.innerHTML = '<li class="rpg-ground">Sin fundamentos registrados en este recorrido.</li>';
    }
  }

  /* ---------- selección de caso ---------- */
  function renderCaseSelect() {
    el.rpgGame.hidden = true;
    el.rpgResult.hidden = true;
    el.rpgSelect.hidden = false;
    el.rpgCaseList.innerHTML = "";
    var cases = window.BRUJULA_CASES || {};
    Object.keys(cases).forEach(function (id) {
      var c = cases[id];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "rpg-case";
      btn.innerHTML =
        '<span class="rpg-case__title">' + escapeHtml(c.title) + "</span>" +
        '<span class="rpg-case__tag">' + escapeHtml(c.tagline || "") + "</span>" +
        '<span class="rpg-case__comp">' + escapeHtml(c.competency || "") + "</span>" +
        '<span class="rpg-case__go">Jugar ▸</span>';
      btn.onclick = function () { startCase(id); };
      el.rpgCaseList.appendChild(btn);
    });
    var first = el.rpgCaseList.querySelector(".rpg-case");
    if (first) first.focus();
  }

  function startCase(id) {
    var caseObj = (window.BRUJULA_CASES || {})[id];
    if (!caseObj) return;
    state = {
      caseId: id, caseObj: caseObj, nodeId: caseObj.start,
      clarity: 50, respect: 50, bond: 50,
      types: [], grounds: [], decisions: 0, picked: null
    };
    el.rpgSelect.hidden = true;
    el.rpgResult.hidden = true;
    el.rpgGame.hidden = false;
    updateMeters();
    renderNode(caseObj.start);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  /* ---------- atajos de teclado: 1..4 eligen opción ---------- */
  function onKey(e) {
    if (el.rpgGame.hidden) return;
    if (/^[1-9]$/.test(e.key) && state && state.picked === null) {
      var idx = parseInt(e.key, 10) - 1;
      var btns = el.rpgChoices.querySelectorAll(".rpg-choice");
      if (btns[idx]) { btns[idx].click(); e.preventDefault(); }
    }
  }

  function init() {
    cacheEls();
    if (!el.rpgSelect) return;
    document.addEventListener("keydown", onKey);
    if (el.rpgAgain) el.rpgAgain.onclick = function () { startCase(state.caseId); };
    if (el.rpgMenu) el.rpgMenu.onclick = renderCaseSelect;
    renderCaseSelect();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }

  window.BrujulaRPG = { restart: renderCaseSelect };
})();
