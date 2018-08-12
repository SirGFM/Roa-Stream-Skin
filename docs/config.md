## Base configuration file

This object controls how the UI is laid out.

| **Name** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `display` | Object | **Yes** | Defines the game window/border |
| `title` | String | **Yes** | Game's title |
| `strict` | Boolean | **No** | Whether the dimensions should be restricted to the maximum value. **Default: false** |
| `timer` | Object | **No** | Configures the timer. If not set, default to L2 controlling it. |
| `input` | Object | **No** | Controls visibility of every input and keyboard configuration. Defaults to gamepad visible. |


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
| `control` | String | **No** | Which button controls the timer. Only works with the gamepad, for now |
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

| **Name** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `gamepad` | Boolean | **No** | Whether the gamepad if visible. **Default: true** |
