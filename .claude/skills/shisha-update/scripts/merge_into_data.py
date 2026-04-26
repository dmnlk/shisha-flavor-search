#!/usr/bin/env python3
"""Merge newly extracted pipe-tobacco entries into data/shishaData.js.

Reads:
  - data/shishaData.js (current data)
  - /tmp/shisha-sources/extracted_auto.json (PyMuPDF output)
  - /tmp/shisha-sources/extracted_group_*.json (subagent Claude outputs, if any)
  - /tmp/shisha-sources/new_pdfs.json (to update state file)

Applies exclusion rules (non-shisha brands) from references/excluded_brands.json,
deduplicates with NFKC-normalized (productName, amount) key, and keeps the
newer date when there's a conflict. Variant-authorization (kouriteikahenkou)
entries arrive with their new price.

Writes:
  - data/shishaData.js (rewritten with sequential ids)
  - .claude/shisha-update-state.json (appended processed PDFs)
  - diff report to stdout
"""
import json
import os
import re
import sys
import unicodedata
from datetime import datetime
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = SKILL_DIR.parents[2]
DATA_FILE = REPO_ROOT / "data" / "shishaData.js"
STATE_FILE = REPO_ROOT / ".claude" / "shisha-update-state.json"
SOURCES = Path("/tmp/shisha-sources")
EXCLUDED_JSON = SKILL_DIR / "references" / "excluded_brands.json"


def norm(s: str) -> str:
    return unicodedata.normalize("NFKC", s).strip() if s else ""


def norm_key(s: str) -> str:
    s = norm(s).upper()
    s = re.sub(r"\s+", "", s)
    s = re.sub(r"[　・，,。、()（）\-_/]", "", s)
    return s


def load_excluded() -> dict:
    return json.loads(EXCLUDED_JSON.read_text())


def is_excluded(entry: dict, rules: dict) -> bool:
    mfr = entry["manufacturer"].upper()
    prod = entry["productName"].upper()
    for pat in rules["substrings"]:
        pu = pat.upper()
        if pu in mfr or pu in prod:
            return True
    for pat in rules["exact_or_prefix"]:
        pu = pat.upper()
        if mfr == pu:
            return True
        for sep in ("・", " ", "-"):
            if mfr.startswith(pu + sep) or prod.startswith(pu + sep):
                return True
    return False


def load_existing_data() -> list[dict]:
    content = DATA_FILE.read_text()
    m = re.search(r"=\s*(\[.*\])\s*$", content, re.DOTALL)
    if not m:
        raise RuntimeError("Could not parse shishaData.js")
    return json.loads(m.group(1))


def infer_manufacturer(product: str, known_brands: list[str]) -> str:
    pn = norm(product)
    pu = pn.upper()
    for b in sorted(known_brands, key=lambda x: -len(x)):
        bn = norm(b).upper()
        if bn and pu.startswith(bn):
            if len(pu) == len(bn) or not pu[len(bn)].isalnum():
                return b
    # fall back: first token
    tokens = pn.split()
    return tokens[0] if tokens else ""


def write_data(entries: list[dict]) -> None:
    lines = ["export const shishaData = ", "    ["]
    for i, e in enumerate(entries):
        lines.append("        {")
        lines.append(f'            "id": {e["id"]},')
        lines.append(f'            "manufacturer": {json.dumps(e["manufacturer"], ensure_ascii=False)},')
        lines.append(f'            "productName": {json.dumps(e["productName"], ensure_ascii=False)},')
        lines.append(f'            "amount": {json.dumps(e["amount"], ensure_ascii=False)},')
        lines.append(f'            "country": {json.dumps(e["country"], ensure_ascii=False)},')
        lines.append(f'            "price": {json.dumps(e["price"], ensure_ascii=False)},')
        lines.append('            "imageUrl": ""')
        lines.append("        }," if i < len(entries) - 1 else "        }")
    lines.append("    ]")
    lines.append("")
    DATA_FILE.write_text("\n".join(lines))


def update_state(new_filenames: list[str], data_changed: bool = False, new_ids: list[int] | None = None) -> None:
    if STATE_FILE.exists():
        state = json.loads(STATE_FILE.read_text())
    else:
        state = {"processed_pdfs": [], "last_run": None, "last_data_updated": None, "last_added_ids": []}
    existing = set(state.get("processed_pdfs", []))
    existing.update(new_filenames)
    state["processed_pdfs"] = sorted(existing)
    state["last_run"] = datetime.now().isoformat(timespec="seconds")
    if data_changed:
        state["last_data_updated"] = datetime.now().isoformat(timespec="seconds")
    if new_ids is not None:
        state["last_added_ids"] = new_ids
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, ensure_ascii=False, indent=2))


def main() -> int:
    rules = load_excluded()
    existing = load_existing_data()
    print(f"Loaded {len(existing)} existing entries")

    # Collect all new entries from PDF extractions
    pdf_entries: list[dict] = []
    auto = SOURCES / "extracted_auto.json"
    if auto.exists():
        pdf_entries.extend(json.loads(auto.read_text()))
    for f in sorted(SOURCES.glob("extracted_group_*.json")):
        pdf_entries.extend(json.loads(f.read_text()))
    print(f"PDF-extracted entries: {len(pdf_entries)}")

    if not pdf_entries:
        print("Nothing to merge.")
        return 0

    # Known brands from current data for manufacturer inference
    known_brands = sorted({e["manufacturer"] for e in existing if e["manufacturer"]})

    # Index existing by key
    merged = {}
    for e in existing:
        k = (norm_key(e["productName"]), norm_key(e["amount"]))
        merged[k] = {**e, "_date_int": 0, "_source": "existing"}

    added = 0
    updated = 0
    excluded_count = 0
    added_keys: set[tuple[str, str]] = set()
    for p in pdf_entries:
        product = norm(p["product"])
        entry = {
            "manufacturer": infer_manufacturer(product, known_brands),
            "productName": product,
            "amount": norm(p["amount"]),
            "country": norm(p["country"]),
            "price": norm(p["price"]),
            "_date_int": int(p["date"]) if p.get("date", "").isdigit() else 0,
            "_source": p.get("source", "pdf"),
        }
        if is_excluded(entry, rules):
            excluded_count += 1
            continue
        k = (norm_key(product), norm_key(entry["amount"]))
        if k in merged:
            existing_entry = merged[k]
            if entry["_date_int"] > existing_entry["_date_int"]:
                if existing_entry.get("manufacturer") and not entry["manufacturer"]:
                    entry["manufacturer"] = existing_entry["manufacturer"]
                merged[k] = entry
                updated += 1
        else:
            merged[k] = entry
            added += 1
            added_keys.add(k)

    # Rebuild final list sorted by manufacturer then product.
    # Preserve existing IDs; assign new monotonically-increasing IDs only to
    # truly new entries so that image filenames (<id>.<ext>) stay stable.
    max_existing_id = max((e.get("id", 0) for e in merged.values() if isinstance(e.get("id"), int)), default=0)
    next_new_id = max_existing_id + 1

    final = sorted(
        [
            {k: v for k, v in e.items() if not k.startswith("_")}
            for e in merged.values()
        ],
        key=lambda e: ((e["manufacturer"] or "").upper(), e["productName"].upper()),
    )
    for e in final:
        if not isinstance(e.get("id"), int) or e.get("id", 0) <= 0:
            e["id"] = next_new_id
            next_new_id += 1
        e.setdefault("imageUrl", "")

    # Collect IDs of newly added entries
    new_ids = [
        e["id"] for e in final
        if (norm_key(e["productName"]), norm_key(e["amount"])) in added_keys
    ]

    write_data(final)

    # Update state file with processed PDF filenames and newly added IDs
    new_pdfs_file = SOURCES / "new_pdfs.json"
    if new_pdfs_file.exists():
        new_pdfs = json.loads(new_pdfs_file.read_text())
        update_state([p["filename"] for p in new_pdfs], data_changed=(added + updated) > 0, new_ids=new_ids)

    print("\n=== Diff report ===")
    print(f"Added:    {added}")
    print(f"Updated:  {updated} (price change via 変更認可)")
    print(f"Excluded: {excluded_count} (non-shisha brands)")
    print(f"Total entries: {len(final)} (was {len(existing)})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
