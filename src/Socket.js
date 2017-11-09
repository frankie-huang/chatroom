function Socket(url,receive){
    var socket = new WebSocket("wss://myafei.cn:19911");
    socket.onmessage = receive

    function send(data){
        socket.send(data)
    }

   return {
       send:send.bind(this)
   }
}

export default Socket