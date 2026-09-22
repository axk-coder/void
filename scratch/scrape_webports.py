import urllib.request
import json
import os
import re
import concurrent.futures
from urllib.parse import urljoin

BASE_HOST = "https://snoopylovestruffle.getinspiredflight.com"
OUTPUT_ROOT = "public/truffled/games"
DATA_FILE = "src/data/truffledGames.json"

os.makedirs(OUTPUT_ROOT, exist_ok=True)
os.makedirs("public/truffled/gamefile", exist_ok=True)

req = urllib.request.Request(f"{BASE_HOST}/js/json/g.json", headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    orig_g_json = json.loads(resp.read().decode("utf-8"))

orig_games = orig_g_json.get("games", [])
print(f"Fetched {len(orig_games)} games from remote catalog")

def fetch_bytes(url, timeout=25):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read()
    except Exception:
        return None

def fetch_text(url, timeout=25):
    b = fetch_bytes(url, timeout)
    if b is None:
        return None
    return b.decode("utf-8", errors="ignore")

def save_file(local_path, data):
    try:
        if os.path.isdir(local_path) or local_path.endswith("/") or local_path.endswith("\\"):
            return
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        if isinstance(data, str):
            with open(local_path, "w", encoding="utf-8") as f:
                f.write(data)
        else:
            with open(local_path, "wb") as f:
                f.write(data)
    except Exception:
        pass

def scrape_single_game(g):
    name = g.get("name", "").strip()
    url = g.get("url", "").strip()
    image = g.get("image")
    category = "webport" if "webport" in name.lower() else "arcade"
    
    clean_title = re.sub(r',?\s*webport', '', name, flags=re.IGNORECASE).strip()

    result_entry = {
        "title": clean_title,
        "category": category,
        "url": url,
        "badge": "Webport" if "webport" in name.lower() else "Truffled",
        "desc": f"{clean_title} online playable game"
    }

    if not url.startswith("/games/") and not url.startswith("/gamefile/"):
        return result_entry

    clean_path = url.lstrip("/")
    if url.startswith("/games/"):
        parts = clean_path.split("/")
        if len(parts) >= 2:
            folder_name = parts[1]
            html_filename = parts[-1] if parts[-1].endswith(".html") or parts[-1].endswith(".htm") else "index.html"
            game_base_url = f"{BASE_HOST}/games/{folder_name}/"
            full_html_url = urljoin(game_base_url, html_filename)
            game_local_dir = os.path.join(OUTPUT_ROOT, folder_name)
            local_html_path = os.path.join(game_local_dir, html_filename)

            if not os.path.exists(local_html_path):
                html_content = fetch_text(full_html_url)
                if html_content:
                    save_file(local_html_path, html_content)

            result_entry["url"] = f"./truffled/games/{folder_name}/{html_filename}"

    elif url.startswith("/gamefile/"):
        parts = clean_path.split("/")
        filename = parts[-1]
        full_html_url = f"{BASE_HOST}/{clean_path}"
        local_html_path = os.path.join("public/truffled/gamefile", filename)
        if not os.path.exists(local_html_path):
            html_content = fetch_text(full_html_url)
            if html_content:
                save_file(local_html_path, html_content)
        result_entry["url"] = f"./truffled/gamefile/{filename}"

    return result_entry

print(f"Scraping and updating full catalog of {len(orig_games)} items...")
with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
    results = list(executor.map(scrape_single_game, orig_games))

with open(DATA_FILE, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print(f"Successfully saved {len(results)} games to {DATA_FILE}!")
