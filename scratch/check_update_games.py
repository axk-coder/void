import urllib.request
import json

target_items = [
    "Ages of Conflict", "Apotheon", "Black Hole Fishing", "Bonk.io",
    "Call Of Duty Modern Warfare", "Cat Goes Fishing", "Celeste 3D",
    "Chess.com", "Cluster Truck", "Crashout Crew", "Dewdrop Dynasty",
    "Don't Bite me Bro!", "Endacopia", "Endoparasitic", "Endoparasitic 2",
    "Geoguessr", "Gamble With Your Friends", "Goober Dash", "How To Fish",
    "Into Space 1", "Into Space 2", "Into Space 3", "I Wanna Be The Guy",
    "Knife Hit", "La Madriguera", "Lethal Company", "Lethal Ape",
    "Lolbeans.io", "Machine Party", "Mindustry", "My Talking baby Hippo",
    "PEAK", "Portal 2", "Rimworld", "SCP: Secret Laboratory", "Shrimp.io",
    "Skribbl.io", "The Binding Of Issac: Repentance", "The Binding of Isaac: Repentance",
    "Totally Acturate Battle Simulator", "Totally Accurate Battle Simulator",
    "Webdashers", "Windowkill", "Worldbox", "Worlds Hardest Game 4",
    "World's Hardest Game 4", "Language translations", "Console",
    "Protozoa", "Verity Theme", "Catppuchin Theme", "Proxy Shortcuts",
    "Hollow Knight", "Ultrakill"
]

req = urllib.request.Request("https://snoopylovestruffle.getinspiredflight.com/js/json/g.json", headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode("utf-8"))
    remote_games = data.get("games", [])

remote_map = {g.get("name", "").strip().lower(): g for g in remote_games}

print(f"Total remote games in catalog: {len(remote_games)}")
matched = []
unmatched = []

for tg in target_items:
    t_low = tg.strip().lower()
    found = None
    if t_low in remote_map:
        found = remote_map[t_low]
    else:
        for k, v in remote_map.items():
            if t_low in k or (len(t_low) > 4 and k in t_low):
                found = v
                break
    if found:
        if (tg, found) not in matched:
            matched.append((tg, found))
    else:
        unmatched.append(tg)

print("\n=== MATCHED IN TRUFFLED 602 CATALOG ===")
for tg, f in matched:
    print(f"MATCH: {tg} -> Name: '{f.get('name')}' | URL: {f.get('url')} | Image: {f.get('image')}")

print("\n=== UNMATCHED IN TRUFFLED CATALOG ===")
for u in unmatched:
    print(f"NOT FOUND: {u}")
