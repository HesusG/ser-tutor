#!/usr/bin/env python3
"""
Ancla cada nodo del organizador gráfico contra el texto del libro.

Dos señales, con papeles distintos:

  1. ANCLA LÉXICA (la que manda). Cada nodo trae una frase verbatim del libro.
     Se busca sobre el texto extraído, normalizado, página por página. La página
     donde aparece es LA página que se cita. Si no aparece en ninguna, el nodo
     no pasa: se reescribe o se elimina del organizador.

  2. CHROMA (contexto y segunda opinión). Recupera el pasaje afín dentro de la
     página encontrada y da la similitud coseno.

Por qué así: el modelo de embeddings por defecto de Chroma (all-MiniLM-L6-v2)
está entrenado en inglés y en español devuelve vecinos plausibles pero falsos
—llegó a puntuar 0.80 un pasaje que no contenía la afirmación—. Un coseno alto
no prueba que la frase esté en esa página; el ancla sí.

La normalización colapsa la partición silábica de la justificación tipográfica
("com - promete" -> "compromete"), que es habitual en este PDF.

Todas las páginas se reportan como página del LIBRO IMPRESO (pdf_page + 4).

Salida:  refs/gestion_verificacion.md
Uso:     python tools/gestion_verify.py
"""
import glob
import json
import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TXT_DIR = os.path.join(ROOT, "refs", "gestion", "txt")
DB_DIR = os.path.join(ROOT, "refs", "gestion", "chroma")
CLAIMS = os.path.join(ROOT, "refs", "gestion_claims.json")
OUT = os.path.join(ROOT, "refs", "gestion_verificacion.md")
COLLECTION = "mgee_sep2010"
OFFSET = 4
LIBRO_MIN, LIBRO_MAX = 55, 64

NIVELES = {
    "raiz": "Raíz — Gestión educativa",
    "institucional": "Nivel 1 — Gestión institucional",
    "escolar": "Nivel 2 — Gestión escolar",
    "pedagogica": "Nivel 3 — Gestión pedagógica",
    "estrategica": "Cierre — Gestión educativa estratégica",
}


def sin_acentos(s):
    return "".join(c for c in unicodedata.normalize("NFD", s)
                   if unicodedata.category(c) != "Mn")


def normalizar(s):
    """Devuelve (texto_normalizado, mapa) con mapa[i] = índice en el original."""
    s = s.replace("­", "-")                      # guion suave
    out, mapa, espacio_pendiente = [], [], False
    i, n = 0, len(s)
    while i < n:
        c = s[i]
        if c == "-":                                  # partición silábica: se come el guion,
            j = i + 1                                 # el espacio que le sigue y el que le
            while j < n and s[j].isspace():           # precede ("de la - bores" -> "de labores")
                j += 1
            espacio_pendiente = False
            i = j
            continue
        if c.isspace():
            espacio_pendiente = bool(out)
            i += 1
            continue
        d = sin_acentos(c).lower()
        d = "".join(ch for ch in d if ch.isalnum())
        if not d:                                     # puntuación: se descarta
            i += 1
            continue
        if espacio_pendiente:
            out.append(" ")
            mapa.append(i)
            espacio_pendiente = False
        for ch in d:
            out.append(ch)
            mapa.append(i)
        i += 1
    return "".join(out), mapa


def excerpt(original, mapa, ini, fin, margen=110):
    """Recorta el original alrededor del tramo normalizado [ini, fin)."""
    a = mapa[max(0, ini - margen)]
    b = mapa[min(len(mapa) - 1, fin + margen)]
    t = " ".join(original[a:b].split())
    return ("…" if a > 0 else "") + t + ("…" if b < len(original) else "")


def cargar_paginas():
    """{libro_page: texto} para el rango de la tarea."""
    paginas = {}
    for f in sorted(glob.glob(os.path.join(TXT_DIR, "p-*.txt"))):
        pdf_pg = int(re.search(r"p-(\d+)", os.path.basename(f)).group(1))
        libro_pg = pdf_pg + OFFSET
        if not (LIBRO_MIN <= libro_pg <= LIBRO_MAX):
            continue
        with open(f, encoding="utf-8") as fh:
            txt = re.sub(r"^\[pdf_page=\d+ libro_page=\d+\]\s*", "", fh.read())
        paginas[libro_pg] = txt
    return paginas


def main():
    if not os.path.isdir(TXT_DIR):
        print(f"ERROR: no hay texto en {TXT_DIR}. Corre tools/gestion_extract.py primero.")
        sys.exit(1)

    paginas = cargar_paginas()
    if not paginas:
        print("ERROR: el rango 55-64 quedó vacío.")
        sys.exit(1)
    norm = {pg: normalizar(txt) for pg, txt in paginas.items()}

    with open(CLAIMS, encoding="utf-8") as fh:
        nodos = json.load(fh)["nodos"]

    col = None
    if os.path.isdir(DB_DIR):
        import chromadb
        col = chromadb.PersistentClient(path=DB_DIR).get_collection(COLLECTION)

    lines = [
        "# Verificación de anclaje — Niveles de concreción de la gestión educativa",
        "",
        "Cada nodo del organizador gráfico, contrastado contra el texto del libro.",
        "",
        "La página la fija un **ancla léxica**: una frase verbatim que debe aparecer en la",
        "página, buscada sobre el texto normalizado. Chroma aporta el contexto y una",
        "similitud coseno como segunda señal, no como criterio de aceptación.",
        "",
        f"Rango de la tarea: **libro pp. {LIBRO_MIN}–{LIBRO_MAX}** "
        f"(= PDF pp. {LIBRO_MIN - OFFSET}–{LIBRO_MAX - OFFSET}; el offset es de {OFFSET} páginas).",
        "",
        "PLACEHOLDER_RESUMEN",
        "",
        "> Vázquez Herrera, E. (Coord.). (2010). *Modelo de gestión educativa estratégica*",
        "> (2.ª ed.). Secretaría de Educación Pública.",
        "",
    ]

    fallos, nivel_actual = [], None
    for nodo in nodos:
        if nodo["nivel"] != nivel_actual:
            nivel_actual = nodo["nivel"]
            lines += ["", f"## {NIVELES[nivel_actual]}", ""]

        ancla_n, _ = normalizar(nodo["ancla"])
        encontradas = []
        for pg in sorted(norm):
            texto_n, mapa = norm[pg]
            k = texto_n.find(ancla_n)
            if k >= 0:
                encontradas.append((pg, excerpt(paginas[pg], mapa, k, k + len(ancla_n))))

        if not encontradas:
            fallos.append((nodo["id"], "ancla no encontrada"))
            lines += [
                f"### ❌ `{nodo['id']}` — ancla NO encontrada en el rango",
                "",
                f"**Nodo:** {nodo['texto']}",
                "",
                f"*Ancla buscada:* «{nodo['ancla']}»",
                "",
            ]
            print(f"❌ {nodo['id']:<4} ancla no encontrada")
            continue

        pg, cita = encontradas[0]
        esperada = nodo.get("libro_page_esperada")
        aviso = ""
        if esperada and pg != esperada:
            aviso = f" ⚠️ se esperaba p. {esperada}"
            fallos.append((nodo["id"], f"página {pg} ≠ esperada {esperada}"))

        cos = None
        if col is not None:
            r = col.query(query_texts=[nodo["query"]], n_results=1,
                          where={"libro_page": pg})
            if r["distances"][0]:
                cos = 1 - r["distances"][0][0]

        extra = f" · cos = {cos:.3f}" if cos is not None else ""
        multi = (f" · el ancla también aparece en p. "
                 f"{', '.join(str(p) for p, _ in encontradas[1:])}" if len(encontradas) > 1 else "")
        marca = "✅" if not aviso else "⚠️"
        lines += [
            f"### {marca} `{nodo['id']}` — libro p. {pg} (PDF p. {pg - OFFSET}){extra}{aviso}{multi}",
            "",
            f"**Nodo:** {nodo['texto']}",
            "",
            f"> {cita}",
            "",
        ]
        print(f"{marca} {nodo['id']:<4} libro p.{pg}"
              + (f"  cos={cos:.3f}" if cos is not None else "") + aviso)

    ok = len(nodos) - len(fallos)
    resumen = f"**Resultado: {ok}/{len(nodos)} nodos anclados a una cita verbatim del libro.**"
    lines[lines.index("PLACEHOLDER_RESUMEN")] = resumen

    with open(OUT, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")

    print(f"\n{resumen.strip('*')}")
    print(f"-> {OUT}")
    if fallos:
        print("\nNodos a corregir:")
        for i, motivo in fallos:
            print(f"  {i}  {motivo}")
        sys.exit(1)


if __name__ == "__main__":
    main()
