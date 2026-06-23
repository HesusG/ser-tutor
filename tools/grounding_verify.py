#!/usr/bin/env python3
"""
Verifica los fundamentos de la Brújula Social contra el índice Chroma del libro
de la profesora (Bisquerra et al., "10 Ideas Clave. Educación Emocional").

Para cada concepto pedagógico de la actividad, recupera los pasajes más afines
del libro y escribe refs/grounding/fundamentos.md con la evidencia (página + cita).

Uso:  python tools/grounding_verify.py
"""
import os
import sys

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                    "refs", "grounding")
DB_DIR = os.path.join(ROOT, "chroma")
COLLECTION = "bisquerra_10ideas"
OUT = os.path.join(ROOT, "fundamentos.md")

# concepto de la actividad  ->  consulta de búsqueda en el libro
QUERIES = {
    "Definición de emoción y educación emocional":
        "qué es una emoción y en qué consiste la educación emocional",
    "Conciencia emocional (nombrar lo que se siente)":
        "conciencia emocional tomar conciencia y poner nombre a las emociones",
    "Regulación emocional (responder, no reaccionar)":
        "regulación emocional manejo de la ira y los impulsos técnicas de relajación",
    "Competencia social y habilidades de relación":
        "competencia social habilidades sociales relaciones interpersonales",
    "Asertividad (claridad con respeto)":
        "asertividad comunicación asertiva respetar derechos propios y de los demás",
    "Escucha y comunicación receptiva":
        "escucha activa comunicación receptiva comprender al otro",
    "Resolución de conflictos":
        "resolución de conflictos negociación mediación en el aula",
    "Autonomía emocional y autoestima":
        "autonomía emocional autoestima responsabilidad actitud positiva",
    "Bienestar y competencias para la vida":
        "competencias para la vida y el bienestar emocional",
}


def main():
    if not os.path.isdir(DB_DIR):
        print(f"ERROR: no existe el índice {DB_DIR}. Corre tools/grounding_index.py primero.")
        sys.exit(1)
    import chromadb
    client = chromadb.PersistentClient(path=DB_DIR)
    col = client.get_collection(COLLECTION)
    print(f"colección '{COLLECTION}': {col.count()} chunks\n")

    lines = [
        "# Fundamentos verificados — Brújula Social RPG",
        "",
        "Cada concepto pedagógico de la actividad, contrastado con el libro de referencia",
        "de la profesora:",
        "",
        "> Bisquerra, R. (coord.) y otros. *10 Ideas Clave. Educación Emocional.* Graó.",
        "",
        "Evidencia recuperada del índice Chroma local (OCR del PDF). Página = página del PDF.",
        "",
    ]

    for concepto, q in QUERIES.items():
        res = col.query(query_texts=[q], n_results=3)
        lines.append(f"## {concepto}")
        lines.append(f"*consulta:* `{q}`\n")
        docs = res["documents"][0]
        metas = res["metadatas"][0]
        dists = res.get("distances", [[None] * len(docs)])[0]
        for d, m, dist in zip(docs, metas, dists):
            snippet = " ".join(d.split())[:320]
            score = f"{1 - dist:.2f}" if dist is not None else "n/a"
            lines.append(f"- **p.{m['pdf_page']}** (afinidad {score}): «{snippet}…»")
        lines.append("")
        print(f"✓ {concepto}: top p.{metas[0]['pdf_page']}")

    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"\nEscrito: {OUT}")


if __name__ == "__main__":
    main()
