import json
import os
import re
import urllib.request
import urllib.parse
import concurrent.futures
from urllib.parse import urljoin, unquote

BASE_URL = "https://snoopylovestruffle.getinspiredflight.com"
DATA_FILE = "src/data/truffledGames.json"

with open(DATA_FILE, "r", encoding="utf-8") as f:
    games = json.load(f)

req = urllib.request.Request(f"{BASE_URL}/js/json/g.json", headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    orig_g_json = json.loads(resp.read().decode("utf-8"))
orig_games_map = {g.get("name", "").strip().lower(): g for g in orig_g_json.get("games", [])}

def fetch_and_save(remote_url, local_path):
    if os.path.exists(local_path) or os.path.isdir(local_path) or local_path.endswith("/") or local_path.endswith("\\"):
        return False
    try:
        encoded_url = urllib.parse.quote(remote_url, safe=':/?&=#+,-_.~%')
        req = urllib.request.Request(encoded_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
            if len(data) > 0:
                os.makedirs(os.path.dirname(local_path), exist_ok=True)
                with open(local_path, "wb") as f:
                    f.write(data)
                return True
    except Exception:
        pass
    return False

tasks = []

for g in games:
    rel_url = g.get("url", "")
    if not rel_url.startswith("./"):
        continue
    
    clean_rel = rel_url[2:]
    local_path = os.path.join("public", clean_rel)
    if not os.path.exists(local_path):
        continue

    with open(local_path, "r", encoding="utf-8", errors="ignore") as fp:
        html = fp.read()

    game_dir = os.path.dirname(local_path)
    title = g.get("title", "").strip().lower()
    orig_g = orig_games_map.get(title)
    orig_url = orig_g.get("url", "") if orig_g else ""

    if orig_url.startswith("/games/"):
        parts = orig_url.lstrip("/").split("/")
        folder = parts[1] if len(parts) > 1 else ""
        remote_base = f"{BASE_URL}/games/{folder}/"
    elif orig_url.startswith("/gamefile/"):
        remote_base = f"{BASE_URL}/gamefile/"
    else:
        remote_base = BASE_URL + "/"

    # Check base href inside html
    base_match = re.search(r'<base\s+href=[\"\']([^\"\']+)[\"\']', html, re.IGNORECASE)
    if base_match:
        html_base = base_match.group(1).strip()
        if html_base.startswith("http"):
            remote_base = html_base

    found_refs = set()
    for m in re.finditer(r'(?:src|href|value|dataUrl|wasmCodeUrl|wasmFrameworkUrl|data-url)\s*=\s*[\"\']([^\"\']+)[\"\']', html):
        val = m.group(1).strip()
        if not val or val.startswith("data:") or val.startswith("blob:") or val.startswith("javascript:") or val.startswith("#") or val.startswith("mailto:"):
            continue
        found_refs.add(val)

    unity_jsons = re.findall(r'[\"\']([^\"\']*\.json)[\"\']', html)
    for u in unity_jsons:
        if "manifest" not in u and not u.startswith("http"):
            found_refs.add(u)

    for ref in found_refs:
        clean_ref = ref.split("?")[0].split("#")[0].lstrip("./")
        if not clean_ref or clean_ref.startswith("http://") or clean_ref.startswith("https://") or clean_ref.startswith("//"):
            continue

        if clean_ref.startswith("/"):
            asset_local = os.path.join("public", clean_ref.lstrip("/"))
            asset_remote = urljoin(BASE_URL, clean_ref)
        else:
            asset_local = os.path.join(game_dir, clean_ref)
            asset_remote = urljoin(remote_base, clean_ref)

        if not os.path.exists(asset_local):
            tasks.append((asset_remote, asset_local))

print(f"Queueing {len(tasks)} missing asset download tasks...")

downloaded = 0
with concurrent.futures.ThreadPoolExecutor(max_workers=24) as executor:
    futures = [executor.submit(fetch_and_save, remote, local) for remote, local in tasks]
    for f in concurrent.futures.as_completed(futures):
        if f.result():
            downloaded += 1

print(f"Successfully downloaded {downloaded} missing files!")
