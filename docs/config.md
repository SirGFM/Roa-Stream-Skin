## Base configuration file

This object controls how the UI is laid out.

| **Name** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `display` | Object | **Yes** | Defines the game window/border |
| `title` | String | **Yes** | Game's title |
| `strict` | Boolean | **No** | Whether the dimensions should be restricted to the maximum value. **Default: false** |
| `timer` | Object | **No** | Configures the timer. If not set, default to L2 controlling it. |
| `input` | Object | **No** | Controls visibility of every input and keyboard configuration. Defaults to gamepad visible. |
| `clear` | Boolean | **No** | Removes every BG detail, leaving only the timer, splits and gamepad. **Default: false** |


## Display object

The display object has a main `type` field, that defines how this object
should be parsed. It may have one of two values: `console` or `custom`.

`console` displays have a `mode` string that must be one of `NES`, `GB`,
`GBC`, `MD`, `MegaDrive`, `GBA` or `SNES`, in any case. Also, do note that
`MD` is equivalent to `MegaDrive` (or Sega Genesis, in North America).

`custom`, on ther other hand, has two Integer fields: `width` and `height`.

For, clarity, both are listed in the tables bellow:

| **Name** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `type` | String | **Yes** | Must be **`console`** |
| `mode` | String | **Yes** | One of `NES`, `GB`, `GBC`, `MD`, `MegaDrive`, `GBA` or `SNES` |

| **Name** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `type` | String | **Yes** | Must be **`custom`** |
| `width` | Integer | **Yes** | |
| `height` | Integer | **Yes** | |


## Timer object

This may \~eventually\~ (as soon as finish refactoring) be used to configure
splits.

| **Name** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `hidden` | Boolean | **No** | Whether the timer should be hidden (e.g., when the game has an in game timer). |
| `control` | String | **No** | Which gamepad button controls the timer. |
| `keyControl` | String | **No** | Which keyboard keymask controls the timer. Either as hexstring ("0x...") or a bitmask ("0b...") |
| `splits` | Object | **No** | Controls display of the game's splits |


## Splits object

| **Name** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `server` | String | **Yes** | URL of the game's splits repository |
| `entries` | Array | **No** | Array of split entries, describing the game's splits. **NOTE**: This is loaded from the server, if specified. |

### Split entry object

| **Name** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `label` | String | **Yes** | The split's label/title/name |
| `time` | Integer | **No** | Best time for this split from the start of the game, in milliseconds. If not set, **defaults to NaN** |


## Input object

NOTE: The nespad logger should output keys sorted as: left, right, up, down, B, A, select, start.

| **Name** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `gamepad` | String | **No** | Gamepad skin to be used. Special name 'false' should be used to disable it! |
| `nespad` | String | **No** | URL of nespad's key logger, if enabled. **Default: empty** |
