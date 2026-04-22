#!/usr/bin/env python3
"""Check MOF kouriteika page and find PDFs not yet processed.

Reads .claude/shisha-update-state.json, fetches the page, diffs the PDF list,
and writes /tmp/shisha-sources/new_pdfs.json with URL + filename for each new one.
"""
import json
import os
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[4]
STATE_FILE = REPO_ROOT / ".claude" / "shisha-update-state.json"
PAGE_URL = "https://www.mof.go.jp/policy/tab_salt/topics/kouriteika.html"
OUT_DIR = Path("/tmp/shisha-sources")
OUT_DIR.mkdir(parents=True, exist_ok=True)


def fetch_page() -> str:
    html_path = OUT_DIR / "mof.html"
    subprocess.run(
        ["curl", "-sL", "-A", "claude-code/1.0", PAGE_URL, "-o", str(html_path)],
        check=True,
    )
    return html_path.read_text()


def extract_pdfs(html: str) -> list[dict]:
    base = "https://www.mof.go.jp/policy/tab_salt/topics/"
    anchors = re.findall(r'<a[^>]+href="([^"]*\.pdf)"[^>]*>(.*?)</a>', html, re.DOTALL)
    urls = []
    seen = set()
    for href, text in anchors:
        t = re.sub(r"<[^>]+>", "", text).strip()
        t = re.sub(r"\s+", " ", t)
        if href.startswith("./"):
            url = base + href[2:]
        elif href.startswith("../"):
            url = base.rsplit("/", 2)[0] + "/" + href[3:]
        else:
            url = base + href
        fname = url.split("/")[-1]
        if fname in seen:
            continue
        seen.add(fname)
        urls.append({"url": url, "filename": fname, "label": t})
    return urls


def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {"processed_pdfs": [], "last_run": None}


def main() -> int:
    state = load_state()
    processed = set(state.get("processed_pdfs", []))
    all_pdfs = extract_pdfs(fetch_page())
    new_pdfs = [p for p in all_pdfs if p["filename"] not in processed]

    out = OUT_DIR / "new_pdfs.json"
    out.write_text(json.dumps(new_pdfs, ensure_ascii=False, indent=2))

    print(f"MOF total PDFs on page: {len(all_pdfs)}")
    print(f"Already processed: {len(processed)}")
    print(f"New PDFs: {len(new_pdfs)}")
    if state.get("last_run"):
        print(f"Last run: {state['last_run']}")
    if new_pdfs:
        print("\nNew PDFs to process:")
        for p in new_pdfs[:20]:
            print(f"  {p['filename']}")
        if len(new_pdfs) > 20:
            print(f"  ... and {len(new_pdfs) - 20} more")
    print(f"\nWrote {out}")
    return 0 if new_pdfs else 1  # exit code 1 when nothing to do


if __name__ == "__main__":
    sys.exit(main())
