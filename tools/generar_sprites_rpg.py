#!/usr/bin/env python3
"""
Genera los sprites y fondos pixel-art de la Brújula Social RPG con la API de
Gemini (nano-banana: gemini-2.5-flash-image), en build-time.

- Sprites de personaje: se piden sobre un fondo CROMA verde y se recortan a PNG
  transparente con Pillow, para componer limpio sobre los fondos.
- Fondos de escena: 16:9 opacos.
- Naming alineado al motor (engine.js):  bg-<fondo>.png  y  <personaje>-<expresion>.png

USO:
    1) Pon tu clave en docs/../.env (raíz del repo):   GOOGLE_API_KEY=xxxx
       (o expórtala:  export GOOGLE_API_KEY=xxxx)
    2) pip install requests pillow
    3) python tools/generar_sprites_rpg.py            # genera todo lo que falte
       python tools/generar_sprites_rpg.py --only student-enojado bg-aula
       python tools/generar_sprites_rpg.py --force    # regenera aunque exista

La clave NUNCA se commitea: .env está en .gitignore.
"""
import argparse
import base64
import io
import os
import sys

try:
    import requests
except ImportError:
    print("ERROR: falta 'requests'  ->  pip install requests pillow")
    sys.exit(1)
try:
    from PIL import Image
except ImportError:
    print("ERROR: falta 'Pillow'  ->  pip install pillow")
    sys.exit(1)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "docs", "assets", "img", "rpg")
MODEL = "gemini-2.5-flash-image"
CHROMA = (0, 177, 64)          # verde croma para keyear sprites
CHROMA_TOL = 90                # tolerancia de distancia al croma

# ------------------------------------------------------------------ estilo
STYLE = (
    "16-bit SNES JRPG pixel-art style, clean limited palette, crisp pixels, "
    "no anti-aliasing blur, bold readable forms, soft top-down lighting, "
    "wholesome respectful school setting in Mexico, no gore, no text, no letters, "
    "no words, no UI, no watermark, no signature, no logo."
)

# Bases de personaje: fijan la apariencia para que sea COHERENTE entre expresiones.
MATEO = (
    "a 14-year-old Mexican middle-school boy named Mateo, short dark hair, brown skin, "
    "navy school polo shirt with a small crest, backpack strap on one shoulder, "
    "full body, standing, facing the viewer"
)
TUTORA = (
    "a 35-year-old Mexican female school tutor, warm professional, shoulder-length dark hair, "
    "cardigan over a blouse, lanyard ID, full body, standing, calm posture, facing the viewer"
)
VALERIA = (
    "a 13-year-old Mexican middle-school girl named Valeria, dark hair in a ponytail, brown skin, "
    "navy school polo shirt with a small crest, holding a phone, full body, standing, facing the viewer"
)
DIEGO = (
    "a 15-year-old Mexican high-school boy named Diego, short curly dark hair, brown skin, "
    "grey hoodie over a school polo, backpack, full body, standing, facing the viewer"
)

def sprite(base, expression):
    return (
        f"Full-body character sprite of {base}. Facial expression and body language: {expression}. "
        f"Centered, full body visible head to feet, isolated on a FLAT PURE CHROMA GREEN background "
        f"(RGB 0,177,64), no shadow on the floor, no props besides those described. {STYLE}"
    )

def scene(desc):
    return (
        f"Wide 16:9 background scene, empty of people: {desc}. "
        f"Establishing shot, eye-level, leaves room in the center for characters. {STYLE}"
    )

# ------------------------------------------------------------------ manifest
# clave de archivo  ->  (tipo, prompt)
SPRITES = {
    "student-enojado":  sprite(MATEO, "angry, frowning, arms crossed, defensive and upset"),
    "student-triste":   sprite(MATEO, "sad, discouraged, looking down, shoulders dropped"),
    "student-neutral":  sprite(MATEO, "neutral, attentive, listening, calm"),
    "student-aliviado": sprite(MATEO, "relieved, small hopeful smile, more relaxed"),
    "tutor-neutral":    sprite(TUTORA, "neutral, attentive, open and approachable"),
    # Caso 2 — Valeria
    "student2-asustada": sprite(VALERIA, "scared, anxious, hugging herself, looking down"),
    "student2-triste":   sprite(VALERIA, "sad, on the verge of tears, discouraged"),
    "student2-neutral":  sprite(VALERIA, "neutral, cautious but listening, calmer"),
    "student2-aliviada": sprite(VALERIA, "relieved, faint hopeful smile, more at ease"),
    # Caso 3 — Diego
    "student3-ansioso":  sprite(DIEGO, "anxious, overwhelmed, tense shoulders, short of breath"),
    "student3-triste":   sprite(DIEGO, "sad, withdrawn, low energy, looking away"),
    "student3-neutral":  sprite(DIEGO, "neutral, breathing calmer, beginning to settle"),
    "student3-aliviado": sprite(DIEGO, "relieved, accepting help, a little lighter"),
}
BACKGROUNDS = {
    "bg-aula":     scene("a tidy Mexican middle-school classroom, desks, chalkboard, windows with daylight"),
    "bg-pasillo":  scene("a school hallway with lockers and noticeboards, daylight"),
    "bg-oficina":  scene("a small school tutoring office, a desk, two chairs, a bookshelf, plant"),
    "bg-patio":    scene("a school courtyard with benches and a basketball hoop, daytime"),
}

URL = "https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={k}"


def get_key():
    key = os.environ.get("GOOGLE_API_KEY")
    if key:
        return key
    env = os.path.join(ROOT, ".env")
    if os.path.exists(env):
        with open(env) as f:
            for line in f:
                if line.strip().startswith("GOOGLE_API_KEY="):
                    return line.strip().split("=", 1)[1].strip().strip('"')
    return None


def call_api(prompt, key):
    resp = requests.post(
        URL.format(m=MODEL, k=key),
        json={"contents": [{"parts": [{"text": prompt}]}],
              "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}},
        headers={"Content-Type": "application/json"}, timeout=180)
    if resp.status_code != 200:
        print(f"  ERROR {resp.status_code}: {resp.text[:300]}")
        return None
    for part in resp.json().get("candidates", [{}])[0].get("content", {}).get("parts", []):
        if "inlineData" in part:
            return base64.b64decode(part["inlineData"]["data"])
    print("  ERROR: la respuesta no trae imagen")
    return None


def chroma_key(img):
    """Convierte el fondo croma verde en transparencia y recorta el bounding box."""
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    cr, cg, cb = CHROMA
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if (abs(r - cr) + abs(g - cg) + abs(b - cb)) < CHROMA_TOL * 3 and g > r and g > b:
                px[x, y] = (r, g, b, 0)
    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img


def save(name, raw, is_sprite):
    img = Image.open(io.BytesIO(raw))
    if is_sprite:
        img = chroma_key(img)
    out = os.path.join(OUT_DIR, name + ".png")
    img.save(out)
    print(f"  guardado: docs/assets/img/rpg/{name}.png  ({img.size[0]}x{img.size[1]})")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*", help="solo estas claves")
    ap.add_argument("--force", action="store_true", help="regenerar aunque exista")
    args = ap.parse_args()

    key = get_key()
    if not key:
        print("ERROR: no hay GOOGLE_API_KEY (ponla en .env o expórtala).")
        sys.exit(1)
    os.makedirs(OUT_DIR, exist_ok=True)

    jobs = []
    for name, prompt in SPRITES.items():
        jobs.append((name, prompt, True))
    for name, prompt in BACKGROUNDS.items():
        jobs.append((name, prompt, False))
    if args.only:
        jobs = [j for j in jobs if j[0] in set(args.only)]

    done = 0
    for name, prompt, is_sprite in jobs:
        out = os.path.join(OUT_DIR, name + ".png")
        if os.path.exists(out) and not args.force:
            print(f"- {name}: ya existe (usa --force para regenerar)")
            continue
        print(f"Generando {name} ...")
        raw = call_api(prompt, key)
        if raw:
            save(name, raw, is_sprite)
            done += 1
    print(f"\nListo: {done} imagen(es) generada(s) en docs/assets/img/rpg/")


if __name__ == "__main__":
    main()
