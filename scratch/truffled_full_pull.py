import urllib.request
import json
import os
import re
import concurrent.futures
from urllib.parse import urljoin, urlparse

BASE_HOST = "https://snoopylovestruffle.getinspiredflight.com"
OUTPUT_ROOT = "public/truffled/games"
DATA_FILE = "src/data/truffledGames.json"

os.makedirs(OUTPUT_ROOT, exist_ok=True)
os.makedirs("scratch", exist_ok=True)

with open(DATA_FILE, "r", encoding="utf-8") as f:
    games_data = json.load(f)

req = urllib.request.Request(f"{BASE_HOST}/js/json/g.json", headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    orig_g_json = json.loads(resp.read().decode("utf-8"))
orig_games_map = {g.get("name", "").strip().lower(): g for g in orig_g_json.get("games", [])}

def fetch_bytes(url, timeout=25):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read()
    except Exception as e:
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

def scrape_single_game(game_entry):
    title = game_entry.get("title", "").strip().lower()
    orig_g = orig_games_map.get(title)
    orig_url = orig_g.get("url", "") if orig_g else ""
    
    if not orig_url or not orig_url.startswith("/games/"):
        return game_entry

    clean_path = orig_url.lstrip("/")
    path_parts = clean_path.split("/")
    if len(path_parts) < 2:
        return game_entry

    folder_name = path_parts[1]
    html_filename = path_parts[-1] if path_parts[-1].endswith(".html") or path_parts[-1].endswith(".htm") else "index.html"
    
    game_base_url = f"{BASE_HOST}/games/{folder_name}/"
    full_html_url = urljoin(game_base_url, html_filename)
    game_local_dir = os.path.join(OUTPUT_ROOT, folder_name)
    local_html_path = os.path.join(game_local_dir, html_filename)

    html_content = fetch_text(full_html_url)
    if not html_content:
        return game_entry

    assets_to_download = set()

    for m in re.finditer(r'(?:src|href|value|data-url)\s*=\s*[\"\']([^\"\']+)[\"\']', html_content):
        v = m.group(1).strip()
        if v and not v.startswith("data:") and not v.startswith("blob:") and not v.startswith("javascript:") and not v.startswith("#") and not v.startswith("mailto:"):
            assets_to_download.add(v)

    unity_configs = re.findall(r'[\"\']([^\"\']*\.json)[\"\']', html_content)
    for ucfg in unity_configs:
        if "manifest" not in ucfg and "schema" not in ucfg and not ucfg.startswith("http"):
            assets_to_download.add(ucfg)

    defold_match = re.search(r'EngineLoader\.load\s*\([^,]+,\s*[\"\']([^\"\']+)[\"\']', html_content)
    if defold_match:
        app_name = defold_match.group(1)
        assets_to_download.add("dmloader.js")
        assets_to_download.add(f"{app_name}_wasm.js")
        assets_to_download.add(f"{app_name}.wasm")
        assets_to_download.add("archive/archive_files.json")

    assets_to_download.add("favicon.ico")
    assets_to_download.add("favicon.png")
    assets_to_download.add("style.css")

    for asset_rel in list(assets_to_download):
        if asset_rel.startswith("http://") or asset_rel.startswith("https://") or asset_rel.startswith("//"):
            continue

        asset_full_url = urljoin(game_base_url, asset_rel)
        clean_rel = asset_rel.split("?")[0].lstrip("./").lstrip("/")
        asset_local_path = os.path.join(game_local_dir, clean_rel)

        if not os.path.exists(asset_local_path):
            data = fetch_bytes(asset_full_url)
            if data:
                save_file(asset_local_path, data)
                
                if clean_rel.endswith(".json"):
                    try:
                        cfg_json = json.loads(data.decode("utf-8", errors="ignore"))
                        if isinstance(cfg_json, dict):
                            for key in ["dataUrl", "wasmCodeUrl", "wasmFrameworkUrl", "asmCodeUrl", "symbolsUrl"]:
                                if key in cfg_json and isinstance(cfg_json[key], str):
                                    sub_rel = cfg_json[key]
                                    sub_full = urljoin(asset_full_url, sub_rel)
                                    sub_local = os.path.join(os.path.dirname(asset_local_path), sub_rel)
                                    if not os.path.exists(sub_local):
                                        sub_data = fetch_bytes(sub_full, timeout=40)
                                        if sub_data:
                                            save_file(sub_local, sub_data)
                            if "content" in cfg_json and isinstance(cfg_json["content"], list):
                                for item in cfg_json["content"]:
                                    for piece in item.get("pieces", []):
                                        p_name = piece.get("name")
                                        if p_name:
                                            p_full = urljoin(asset_full_url, p_name)
                                            p_local = os.path.join(os.path.dirname(asset_local_path), p_name)
                                            if not os.path.exists(p_local):
                                                p_data = fetch_bytes(p_full, timeout=40)
                                                if p_data:
                                                    save_file(p_local, p_data)
                    except Exception:
                        pass

    html_content = re.sub(r'<script async src=\"https://www\.googletagmanager\.com[^\"]*\"></script>', '', html_content)
    html_content = re.sub(r'<script>\s*window\.dataLayer\s*=\s*window\.dataLayer.*?</script>', '', html_content, flags=re.DOTALL)
    html_content = re.sub(r'<script[^>]*src=[\"\'][^\"\']*js/all\.min\.js[\"\'][^>]*>\s*</script>', '', html_content)
    html_content = re.sub(r'<script[^>]*src=[\"\'][^\"\']*js/main\.js[\"\'][^>]*>\s*</script>', '', html_content)
    html_content = re.sub(r'<!--(.*?)-->', '', html_content, flags=re.DOTALL)

    shim = '<script>window.alert=window.prompt=window.confirm=function(){};</script>\n'
    if '<head>' in html_content:
        html_content = html_content.replace('<head>', f'<head>\n{shim}', 1)
    elif '<HEAD>' in html_content:
        html_content = html_content.replace('<HEAD>', f'<HEAD>\n{shim}', 1)
    else:
        html_content = f'{shim}{html_content}'

    save_file(local_html_path, html_content)
    game_entry["url"] = f"./truffled/games/{folder_name}/{html_filename}"
    return game_entry

print(f"Starting bulk download for {len(games_data)} games...")
with concurrent.futures.ThreadPoolExecutor(max_workers=16) as executor:
    results = list(executor.map(scrape_single_game, games_data))

with open(DATA_FILE, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print("Scraping completed!")
