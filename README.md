# GFM's Gaming Arena Skin

(aka, the skin that I use during [Rivals of Aether](http://www.rivalsofaether.com/) tournaments)


## Quick start

Eventually I'll write a proper quick start... However, these are the required steps:

1. Set up a WebSocket proxy (e.g., [GoWebSocketProxy](https://github.com/SirGFM/GoWebSocketProxy))
1. Add avatars for players on `img/players/`
1. Modify `scripts/players.js` to list player's names and avatar
1. Serve the pages through HTTP (e.g., `python -m SimpleHTTPServer`)
1. Add a source on the streaming application of page `/control?ip=<proxy_ip>&port=<proxy_port>`
1. Set the color key on this source, so the game's view may be placed behind it
1. Place the game view at position (160, 18)
    * **NOTE:** The game's window must be upscaled by 2 (from the original resolution)
1. Access `http://<URL>/view` on the device that will be used to control the skin
1. Set the proxy's IP/PORT and press update (to connect)
1. Configure the match as desired and press update (again) to actually update the view


## External resources

* [m5x7 by Daniel Linssen](https://managore.itch.io/m5x7)
* Character portraits were taken from the game and slightly modified  (to fit within a rectangle)
  with the charbox found on the [game's presskit](http://www.rivalsofaether.com/presskit/) and on
  the DLC pages ([1](http://store.steampowered.com/app/686220/Rivals_of_Aether_Ori_and_Sein/) and
  [2](http://store.steampowered.com/app/730770/Rivals_of_Aether_Ranno_and_Clairen/))

