#!/usr/bin/env python3
"""
Extrae el texto del libro "Modelo de Gestión Educativa Estratégica" (SEP, 2010).

El PDF trae capa de texto, así que basta pypdf: no hace falta el pipeline de OCR
de tools/grounding_ocr.sh.

OJO con la numeración: las páginas que cita el curso son las del LIBRO IMPRESO,
no las del PDF. El offset es constante en todo el volumen:

    página del libro = página del PDF + 4

Verificado en tres puntos: PDF 51 -> "55", PDF 60 -> "64", PDF 153 -> "157".

Los archivos se nombran por página del PDF (p-051.txt) y llevan una cabecera
con ambas numeraciones.

Salida:  refs/gestion/txt/p-001.txt ... p-153.txt
refs/ está en .gitignore: el PDF con derechos NO se publica.

Uso:  python tools/gestion_extract.py
"""
import os
import sys

PDF = "/home/d3r/Downloads/Lectura 6 Modelo Gestión.pdf"
ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                    "refs", "gestion")
TXT_DIR = os.path.join(ROOT, "txt")
OFFSET = 4


def main():
    if not os.path.exists(PDF):
        print(f"ERROR: no encuentro el PDF en {PDF}")
        sys.exit(1)

    import pypdf
    os.makedirs(TXT_DIR, exist_ok=True)
    reader = pypdf.PdfReader(PDF)

    vacias = 0
    for i, page in enumerate(reader.pages, start=1):
        texto = page.extract_text() or ""
        if not texto.strip():
            vacias += 1
        libro = i + OFFSET
        with open(os.path.join(TXT_DIR, f"p-{i:03d}.txt"), "w", encoding="utf-8") as fh:
            fh.write(f"[pdf_page={i} libro_page={libro}]\n{texto}")

    print(f"{len(reader.pages)} páginas -> {TXT_DIR}")
    print(f"  páginas sin texto extraíble: {vacias}")
    print(f"  rango de la tarea: libro 55-64 = PDF {55 - OFFSET}-{64 - OFFSET}")


if __name__ == "__main__":
    main()
