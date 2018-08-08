## Base configuration file

This object controls how the UI is laid out.

| **Name** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `display` | Object | **Yes** | Defines the game window/border |
| `title` | String | **Yes** | Game's title |
| `strict` | Boolean | **No** | Whether the dimensions should be restricted to the maximum value. **Default: false** |

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
