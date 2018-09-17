/**
 * Handle displaying keypresses as served by a WebSocket server. Get the logger
 * from https://github.com/SirGFM/goLogKeys.
 *
 * Each message received is a 32bits bitmask, where each set bit represents a
 * pressed key and cleared bits are released keys.
 */

/**
 * Update the images stored in ctx, based on the big-endian bit-mask in msg.
 *
 * @param{ctx} A context returned by setupNewKeypad
 * @param{msg} A string with the big-endian bit-mask.
 */
let updateView = function(ctx, msg) {
    let on = 0;

    /* Convert the message into a bit-mask for setting keys */
    for (let i in msg) {
        let d = parseInt(msg[i])

        on = (d << 4 * i) | on;
    }

    /* Set keys on the bitmask as visible and the others as hidden */
    for (let i in ctx.keys) {
        let st = 'hidden';

        if (on & (1 << i)) {
            st = 'visible';
        }

        if (ctx.keys[i] != null) {
            ctx.keys[i].style.visibility = st;
        }
    }
}

/**
 * Starts listening to a keylogger, and setup the images it uses for buttons.
 *
 * @param{keys} An array of images, sequenced as the bits from the sender.
 * @param{address} Address of the serving WebSocket key logger.
 */
function setupNewKeypad(keys, address) {
    let ctx = {}
    if (!keys) {
        ctx.keys = [];
    }
    else {
        ctx.keys = keys;
    }
    ctx.ws = new WebSocket(address)
    ctx.open = function(ev) {
        console.log("Opened connection to: " + address);
    }
    ctx.close = function(ev) {
        console.log("Closed connection with: " + address);
    }
    ctx.recv = function(ev) {
        updateView(ctx, ev.data);
    }
    ctx.err = function(ev) {
        console.log("Error sending/receiving message!");
    }
    ctx.clean = function() {
        ctx.ws.close();
    }

    try {
        ctx.ws.addEventListener("open", ctx.open);
        ctx.ws.addEventListener("close", ctx.close);
        ctx.ws.addEventListener("message", ctx.recv);
        ctx.ws.addEventListener("error", ctx.err);
    } catch (e) {
        ctx.clean();
        throw e;
    }

    return ctx;
}
