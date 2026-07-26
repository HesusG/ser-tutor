#!/usr/bin/env python3
"""
Índice Chroma del libro "Modelo de Gestión Educativa Estratégica" (SEP, 2010).

Entrada:  refs/gestion/txt/p-*.txt   (generado por tools/gestion_extract.py)
Salida:   refs/gestion/chroma/       (store Chroma persistente)
          colección: "mgee_sep2010"

Cada chunk guarda las DOS numeraciones:
    pdf_page   -> la del archivo PDF
    libro_page -> la impresa en el libro (pdf_page + 4)

Todas las citas que salgan de aquí se numeran con libro_page, que es la que pide
el curso. Es el punto entero de este índice.

Se indexa el libro completo, no sólo el rango de la tarea, para poder contrastar
si algún concepto aparece también fuera de las páginas 55-64.

refs/ está en .gitignore: el corpus y el PDF NO se publican.

Uso:  pip install chromadb
      python tools/gestion_index.py
"""
import glob
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from grounding_index import chunk_text, page_num  # noqa: E402  (mismo chunking que el otro corpus)

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                    "refs", "gestion")
TXT_DIR = os.path.join(ROOT, "txt")
DB_DIR = os.path.join(ROOT, "chroma")
COLLECTION = "mgee_sep2010"
OFFSET = 4
SOURCE = "Vázquez Herrera (Coord.) — Modelo de gestión educativa estratégica (SEP, 2010, 2.ª ed.)"


def strip_header(texto):
    """Quita la cabecera [pdf_page=.. libro_page=..] que escribe gestion_extract."""
    return re.sub(r"^\[pdf_page=\d+ libro_page=\d+\]\s*", "", texto)


def main():
    files = sorted(glob.glob(os.path.join(TXT_DIR, "p-*.txt")), key=page_num)
    if not files:
        print(f"ERROR: no hay texto en {TXT_DIR}. Corre tools/gestion_extract.py primero.")
        sys.exit(1)

    ids, docs, metas = [], [], []
    for f in files:
        pdf_pg = page_num(f)
        with open(f, encoding="utf-8", errors="ignore") as fh:
            txt = strip_header(fh.read())
        for j, ch in enumerate(chunk_text(txt)):
            ids.append(f"p{pdf_pg:03d}-{j}")
            docs.append(ch)
            metas.append({
                "pdf_page": pdf_pg,
                "libro_page": pdf_pg + OFFSET,
                "source": SOURCE,
            })

    print(f"{len(files)} páginas -> {len(docs)} chunks")

    import chromadb
    client = chromadb.PersistentClient(path=DB_DIR)
    try:
        client.delete_collection(COLLECTION)
    except Exception:
        pass
    col = client.create_collection(COLLECTION, metadata={"hnsw:space": "cosine"})

    B = 200
    for i in range(0, len(docs), B):
        col.add(ids=ids[i:i + B], documents=docs[i:i + B], metadatas=metas[i:i + B])
        print(f"  indexados {min(i + B, len(docs))}/{len(docs)}")

    print(f"\nListo. Colección '{COLLECTION}' con {col.count()} chunks en {DB_DIR}")

    # Prueba de humo: el pasaje que nombra los tres niveles vive en el libro p. 56.
    r = col.query(
        query_texts=["niveles de concreción en el sistema: institucional, escolar y pedagógica"],
        n_results=3,
        where={"$and": [{"libro_page": {"$gte": 55}}, {"libro_page": {"$lte": 64}}]},
    )
    print("\nPrueba de humo (rango libro 55-64):")
    for meta, dist in zip(r["metadatas"][0], r["distances"][0]):
        print(f"  libro p.{meta['libro_page']} (PDF p.{meta['pdf_page']})  cos={1 - dist:.3f}")


if __name__ == "__main__":
    main()
