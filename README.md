# GFM's Gaming Arena Overlay

There are two different overlays within this repository (which kinda share some of the code...)

* `./control/index.html` is the overlay that I use during [Rivals of Aether](http://www.rivalsofaether.com/) tournaments)
    * `./view/index.html` is a webpage used to control the above overlay
* `./speedrun/index.html` is the overlay that I use for running games

No matter which overlay you want to run, you'll need a web server. I highly advice using Python's `SimpleHTTPServer`, simply because it's quite easy to set up.

However, if you want to use the Rivals of Aether overlay, you'll need a WebSocket proxy. I've started writing one, which can be found on [GoWebSocketProxy](https://github.com/SirGFM/GoWebSocketProxy)).


## "Quick start" for running games


1. Serve the pages through HTTP (e.g., `python -m SimpleHTTPServer`)
1. Add a source on the streaming application of page (i.e., connect to `http://<serving_ip>:<serving_port>/speedrun`)
1. Add any of the following [arguments](https://en.wikipedia.org/wiki/Query_string), as desired:
    * `gameConsole`: Configures the view's dimensions to the console you'll be running. May be one of:
        * `NES` or `nes`:
            * width = 598; height = 470;
        * `GB`, `GBC`, `gb` or `gbc`:
            * width = 480; height = 432;
        * "MegaDrive`, `megadrive`, `MD` or `md`:
            * width = 640; height = 480;
            * Nope, I didn't configure it to accept `Sega Genesis` as the name...
        * `GBA` or `gba`:
            * width = 720; height = 480;
        * `SNES` or `snes`:
            * width = 768; height = 672;
    * `gameWidth`: Manually configures the game's width
    * `gameHeight`: Manually configures the game's height
    * `gameTitle`: Configures the title of the game
    * `nogamepad`: Hides the gamepad view
    * `timerButton`: Configures which gamepad button controls the timer (defaults to `L2`/`LT`)
1. Set the game's source on the streaming application on the coordinates given at the bottom right corner of the page

To start or stop the timer, press the timer button once. To reset it, press the button twice (in less than 100ms!!).

## "Quick start" for streaming RoA matches

Eventually I'll write a proper quick start... However, these are the required steps:

1. Set up a WebSocket proxy (e.g., [GoWebSocketProxy](https://github.com/SirGFM/GoWebSocketProxy))
1. Add avatars for players on `img/players/`
1. Modify `scripts/players.js` to list player's names and avatar
1. Serve the pages through HTTP (e.g., `python -m SimpleHTTPServer`)
1. Add a source on the streaming application of page (i.e., connect to `http://<serving_ip>:<serving_port>/control?ip=<proxy_ip>&port=<proxy_port>`)
1. Set the color key on this source, so the game's view may be placed behind it
1. Place the game view at position (160, 18)
    * **NOTE:** The game's window must be upscaled by 2 (from the original resolution)
1. Access `http://<server_ip>:<serving_port>/view` on the device that will be used to control the skin
1. Set the proxy's IP/PORT and press update (to connect)
1. Configure the match as desired and press update (again) to actually update the view


## External resources

* [m5x7 by Daniel Linssen](https://managore.itch.io/m5x7)
* Character portraits were taken from the game and slightly modified  (to fit within a rectangle)
  with the charbox found on the [game's presskit](http://www.rivalsofaether.com/presskit/) and on
  the DLC pages ([1](http://store.steampowered.com/app/686220/Rivals_of_Aether_Ori_and_Sein/) and
  [2](http://store.steampowered.com/app/730770/Rivals_of_Aether_Ranno_and_Clairen/))

