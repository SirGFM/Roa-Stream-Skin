let conn = function() {
    /**
     * Open a new connection. After this, the caller only has to call xhr.send(obj).
     *
     * @param{url} HTTP address of the connecting server.
     * @param{mode} HTTP Method for the connection (e.g., PUT or GET).
     * @param{onLoad} Callback executed when the request is fully sent/received.
     *                onLoad must receive a single argument (the response).
     * @return A newly set up XMLHttpRequest.
     */
    let openConn = function(url, mode, onLoad=null, async=true) {
        let xhr = new XMLHttpRequest();
        xhr.open(mode, url, async);

        if (onLoad) {
            let cb = function (e) {
                let res = e.target.response;
                onLoad(res);
            };
            xhr.addEventListener("loadend", cb);
        }
        xhr.addEventListener("error", function(e) {
            alert(e);
        });

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

        return xhr;
    };

    return {
        /**
         * Retrieve a JSON object from the server.
         *
         * @param{url} HTTP address of the connecting server.
         * @param{onLoad} Callback executed when the request is fully received.
         *                onLoad must receive a single argument (the response).
         */
        getData: function(url, onLoad) {
            let xhr = openConn(url, "GET", onLoad);
            xhr.send(null);
        },

        /**
         * Save a JSON object on the server.
         *
         * @param{url} HTTP address of the connecting server.
         * @param{obj} The object to be sent.
         */
        sendData: function(url, obj, onSave=null) {
            if (!onSave) {
                onSave = function (e) {
                    alert("Object saved successfully");
                }
            }
            let xhr = openConn(url, "POST", onSave);
            xhr.send(obj);
        }
    };
}();
