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
let _updateView = function(ctx, msg) {
    let on = 0;

    /* Convert the message into a bit-mask for setting keys */
    for (let i in msg) {
        let d = parseInt(msg[i], 16);

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
 * Update the context, reading from its buffer in a BG thread.
 *
 * @param{ctx} A context returned by setupNewKeypad
 */
let updateView = function(ctx) {
    while (ctx.buf.length > 0) {
        let data = ctx.buf.shift();
        _updateView(ctx, data);
    }
}

/**
 * Starts listening to a keylogger, and setup the images it uses for buttons.
 *
 * @param{keys} An array of images, sequenced as the bits from the sender.
 * @param{address} Address of the serving WebSocket key logger.
 */
function setupNewKeypad(keys, address) {
    /* Setup the context with the keys array and with its BG buffer/FIFO */
    let ctx = {};
    if (!keys) {
        ctx.keys = [];
    }
    else {
        ctx.keys = keys;
    }
    ctx.buf = [];
    ctx.isCleaning = false;
    ctx.addr = address;
    ctx.cb = null;
    ctx.didStart = false;

    /* Setup helper functions for the websocket */
    ctx.open = function(ev) {
        console.log("Opened connection to: " + address);
        ctx.didStart = true;
    }
    ctx.close = function(ev) {
        console.log("Closed connection with: " + address);
        ctx.didStart = false;
        if (!ctx.isCleaning) {
            /* Connection closed because of an error, restart it! */
            // TODO Check if from a close and, if not, restart the connection
        }
    }
    ctx.recv = function(ev) {
        ctx.buf.push(ev.data);
    }
    ctx.err = function(ev) {
        console.log("Error sending/receiving message!");
    }
    ctx.clean = function() {
        ctx.isCleaning = true;
        ctx.ws.close();
        if (ctx.cb != null) {
            clearInterval(ctx.cb);
            ctx.cb = null;
        }
    }
    ctx.start = function() {
        /* Setup the websocket */
        ctx.ws = new WebSocket(address);
        /* Setup all event handlers */
        try {
            ctx.ws.addEventListener("open", ctx.open);
            ctx.ws.addEventListener("close", ctx.close);
            ctx.ws.addEventListener("message", ctx.recv);
            ctx.ws.addEventListener("error", ctx.err);
        } catch (e) {
            ctx.clean();
            throw e;
        }
    }

    /* Create a BG thread to handle all inputs (removing workload from
     * ctx.recv()) */
    ctx.cb = setInterval(updateView, 1000 / 20, ctx);

    /* Start the connection */
    ctx.start();
    // TODO If the connection didn't open after a while (10 seconds?), throw an error!

    return ctx;
}
