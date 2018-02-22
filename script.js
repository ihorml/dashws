function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function start() {

    function sendLoginCommand(socket) {

        const blynkHeader = function (msg_type, msg_id, msg_len) {
            return String.fromCharCode(
                msg_type,
                msg_id  >> 8, msg_id  & 0xFF,
                msg_len >> 8, msg_len & 0xFF
            );
        };

        var token = "130a06286b8b450ba3cbc5557fa1d61a";

        var LOGIN = 2;

        var MSG_ID = 1;

        socket.send(
            str2ab(
                blynkHeader(LOGIN, MSG_ID, token.length) + token
            )
        )
    }

    function onSocketError(socket) {
        return function () {
            console.log('Socket Error');
        }
    }

    function onSocketClose(socket) {
        return function () {
            console.log('Socket Closed')
        }
    }

    function onSocketOpen(socket) {
        return function () {
            console.log('Socket Open successful');

            function keepAlive() {
                var timeout = 1000;
                socket.send('');
                setTimeout(keepAlive, timeout);
            }

            // keepAlive();

            sendLoginCommand(socket);
        }
    }

    function onSocketMessage(socket) {
        return function (evt) {
            console.log('Socket Message');
            console.log(evt.data);
            console.log(str2ab(evt.data));
        }
    }

    const END_POINT = "wss://localhost:9443/dashws";

    var socket = new WebSocket(END_POINT);

    socket.binaryType = 'arraybuffer';
    socket.onopen = onSocketOpen(socket);
    socket.onclose = onSocketClose(socket);
    socket.onmessage = onSocketMessage(socket);
    socket.onerror = onSocketError(socket);

}