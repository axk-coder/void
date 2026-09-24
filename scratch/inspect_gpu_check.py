with open("public/tools/blender/assets/index-ik7j_WkV.js", "r") as f:
    js = f.read()

import re
matches = re.finditer(r'(?:requestAdapter|navigator\.gpu|WebGPU|gpu-warning|disabled|software)[^;{}]{0,150}', js)
for i, m in enumerate(matches):
    if i < 30:
        print(f"[{i}] {m.group(0)}")

