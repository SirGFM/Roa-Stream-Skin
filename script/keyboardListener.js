/**
 * Handle displaying keypresses as served by a WebSocket server. Get the logger
 * from https://github.com/SirGFM/goLogKeys.
 *
 * Each message received is a 32bits bitmask, where each set bit represents a
 * pressed key and cleared bits are released keys.
 */

/** How long to wait until a connection timeouts during its connection */
const connTimeout = 10 * 60 * 1000;

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
    if (ctx.buf.length == 0) {
        return;
    }
    /* Grab only the latest data, as it overrides everything else */
    let data = ctx.buf.pop();
    while (ctx.buf.length > 0) {
        ctx.buf.pop();
    }
    _updateView(ctx, data);
}

/**
 * Checks whether the connection was successfull or whether it timedout.
 *
 * @param{ctx} A context returned by setupNewKeypad
 */
let checkTimeout = function(ctx) {
    ctx.close();
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
    ctx.openCb = null;
    ctx.ws = null;

    /* Setup helper functions for the websocket */
    ctx.open = function(ev) {
        console.log("Opened connection to: " + address);
        clearInterval(ctx.openCb);
        ctx.openCb = null;
    }
    ctx.close = function(ev) {
        console.log("Closed connection with: " + address);
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
    ctx.close = function() {
        ctx.isCleaning = true;
        if (ctx.ws != null) {
            ctx.ws.close();
        }
        if (ctx.cb != null) {
            clearInterval(ctx.cb);
            ctx.cb = null;
        }
        if (ctx.openCb != null) {
            clearInterval(ctx.openCb);
            ctx.openCb = null;
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
            ctx.close();
            throw e;
        }
    }

    /* Create a BG thread to handle all inputs (removing workload from
     * ctx.recv()) */
    ctx.cb = setInterval(updateView, 1000 / 20, ctx);

    /* Start the connection */
    ctx.openCb = setTimeout(checkTimeout, connTimeout, ctx);
    ctx.start();

    return ctx;
}
