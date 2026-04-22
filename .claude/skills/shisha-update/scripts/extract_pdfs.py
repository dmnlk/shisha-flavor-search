#!/usr/bin/env python3
"""Classify new PDFs and extract pipe-tobacco rows via PyMuPDF where possible.

Inputs: /tmp/shisha-sources/pdfs/*.pdf (downloaded via curl)
        /tmp/shisha-sources/new_pdfs.json (list of {url, filename, label})

Outputs:
  - /tmp/shisha-sources/extracted_auto.json  (entries extracted without Claude)
  - /tmp/shisha-sources/garbled.json          (PDF filenames that need Claude)
  - /tmp/shisha-sources/classification.json   (full classification for debugging)

PDFs where PyMuPDF can see "パイプたばこ" are parsed here; anything else is
handed off to Claude via subagent (see SKILL.md). Traditional pipe tobacco
brands are NOT filtered here — that happens in merge_into_data.py.
"""
import json
import os
import re
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    print("PyMuPDF not installed. Run: pip3 install pymupdf", file=sys.stderr)
    sys.exit(2)

PDF_DIR = Path("/tmp/shisha-sources/pdfs")
NEW_PDFS = Path("/tmp/shisha-sources/new_pdfs.json")
OUT_DIR = Path("/tmp/shisha-sources")


def classify_and_extract(filenames: list[str]) -> tuple[list[dict], list[str], list[str]]:
    extracted = []
    garbled = []
    no_pipe = []

    for fname in filenames:
        path = PDF_DIR / fname
        if not path.exists():
            print(f"WARN: {fname} not downloaded, skipping", file=sys.stderr)
            continue
        is_henkou = "kouriteikahenkou" in fname
        date_ymd = fname[:8]
        doc = fitz.open(path)
        text = "\n".join(page.get_text() for page in doc)
        doc.close()

        if "パイプたばこ" in text:
            extracted.extend(parse_block(text, date_ymd, is_henkou, fname))
        elif any(k in text for k in ("製造たばこ", "小売定価", "紙巻", "葉巻")):
            no_pipe.append(fname)
        else:
            garbled.append(fname)

    return extracted, garbled, no_pipe


def parse_block(text: str, date_ymd: str, is_henkou: bool, source: str) -> list[dict]:
    """Parse pipe-tobacco rows from a readable PDF's text dump.

    The MOF layout repeats: 「パイプたばこ」, product (1-3 lines), amount (1-2 lines),
    country, price ("X,XXX円"). We scan for each 「パイプたばこ」 and take the
    block until the next section header.
    """
    HEADERS = {
        "パイプたばこ", "葉巻たばこ", "紙巻たばこ", "刻みたばこ", "かぎたばこ",
        "加熱式たばこ", "製造たばこの区分", "製品の区分", "製造国", "（地）",
        "小売定価",
    }
    out = []
    lines = text.split("\n")
    i = 0
    while i < len(lines):
        if lines[i].strip() == "パイプたばこ":
            block = []
            j = i + 1
            while j < len(lines):
                ln = lines[j].strip()
                if not ln:
                    j += 1
                    continue
                if ln in HEADERS or ("名" == ln[:1] and "称" in ln):
                    break
                block.append(ln)
                j += 1
            price_idx = next(
                (k for k, ln in enumerate(block) if "円" in ln and re.search(r"\d", ln)),
                None,
            )
            if price_idx is not None and price_idx >= 3:
                price = block[price_idx].strip()
                country = block[price_idx - 1].strip()
                amount = "".join(block[price_idx - 3 : price_idx - 1]).strip()
                product = " ".join(block[: price_idx - 3]).strip()
                out.append({
                    "date": date_ymd,
                    "is_henkou": is_henkou,
                    "product": product,
                    "amount": amount,
                    "country": country,
                    "price": price,
                    "source": source,
                })
            i = j
        else:
            i += 1
    return out


def main() -> int:
    if not NEW_PDFS.exists():
        print(f"ERROR: {NEW_PDFS} not found. Run check_new_pdfs.py first.", file=sys.stderr)
        return 2
    new_list = json.loads(NEW_PDFS.read_text())
    filenames = [p["filename"] for p in new_list]

    extracted, garbled, no_pipe = classify_and_extract(filenames)

    (OUT_DIR / "extracted_auto.json").write_text(
        json.dumps(extracted, ensure_ascii=False, indent=2)
    )
    (OUT_DIR / "garbled.json").write_text(
        json.dumps(garbled, ensure_ascii=False, indent=2)
    )
    (OUT_DIR / "classification.json").write_text(
        json.dumps(
            {
                "readable_pipe_count": sum(
                    1 for f in filenames if f not in garbled and f not in no_pipe
                ),
                "garbled": garbled,
                "no_pipe": no_pipe,
            },
            ensure_ascii=False,
            indent=2,
        )
    )

    print(f"Auto-extracted entries: {len(extracted)}")
    print(f"Garbled PDFs (need Claude): {len(garbled)}")
    print(f"No-pipe PDFs (skipped): {len(no_pipe)}")
    if garbled:
        print("\nGarbled PDFs to hand off to subagents:")
        for f in garbled:
            print(f"  {f}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
