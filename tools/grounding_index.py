#!/usr/bin/env python3
"""
Construye un índice Chroma local a partir del OCR del libro de la profesora
(Bisquerra et al., "10 Ideas Clave. Educación Emocional").

Entrada:  refs/grounding/ocr/p-*.txt   (generado por grounding_ocr.sh)
Salida:   refs/grounding/chroma/       (store Chroma persistente)
          colección: "bisquerra_10ideas"

refs/ está en .gitignore: el corpus y el PDF NO se publican.

Uso:  pip install chromadb
      python tools/grounding_index.py
"""
import glob
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                    "refs", "grounding")
OCR_DIR = os.path.join(ROOT, "ocr")
DB_DIR = os.path.join(ROOT, "chroma")
COLLECTION = "bisquerra_10ideas"
CHUNK = 900
OVERLAP = 150


def page_num(path):
    m = re.search(r"p-(\d+)", os.path.basename(path))
    return int(m.group(1)) if m else 0


def chunk_text(text, size=CHUNK, overlap=OVERLAP):
    text = re.sub(r"[ \t]+", " ", text).strip()
    out, i = [], 0
    while i < len(text):
        out.append(text[i:i + size])
        i += size - overlap
    return [c for c in out if len(c.strip()) > 80]


def main():
    files = sorted(glob.glob(os.path.join(OCR_DIR, "p-*.txt")), key=page_num)
    if not files:
        print(f"ERROR: no hay OCR en {OCR_DIR}. Corre tools/grounding_ocr.sh primero.")
        sys.exit(1)

    ids, docs, metas = [], [], []
    for f in files:
        pg = page_num(f)
        with open(f, encoding="utf-8", errors="ignore") as fh:
            txt = fh.read()
        for j, ch in enumerate(chunk_text(txt)):
            ids.append(f"p{pg:03d}-{j}")
            docs.append(ch)
            metas.append({"pdf_page": pg, "source": "Bisquerra et al. — 10 Ideas Clave. Educación Emocional"})

    print(f"{len(files)} páginas OCR -> {len(docs)} chunks")

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


if __name__ == "__main__":
    main()
