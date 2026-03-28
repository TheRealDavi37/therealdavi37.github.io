import urllib.request
import os

icons = {
    "laptop": "mdi:laptop",
    "book": "mdi:book-open-page-variant",
    "bottle": "mdi:bottle-water",
    "keys": "mdi:key",
    "pen": "mdi:pen",
    "wallet": "mdi:wallet",
    "umbrella": "mdi:umbrella",
    "smartphone": "mdi:cellphone",
    "watch": "mdi:watch",
    "flashlight": "mdi:flashlight",
    "knife": "mdi:knife",
    "powerbank": "mdi:battery-charging-60",
    "firstaid": "mdi:medical-bag",
    "headphones": "mdi:headphones",
    "sunglasses": "mdi:sunglasses"
}

os.makedirs("icons", exist_ok=True)

for name, icon_id in icons.items():
    url = f"https://api.iconify.design/{icon_id.replace(':', '/')}.svg?color=white&width=48&height=48"
    dest = f"icons/{name}.svg"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req) as response, open(dest, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Downloaded {name}.svg")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
