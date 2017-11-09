ws=new WebSocket("wss://myafei.cn:19911");

ws.onmessage = function(data){
    console.log(data)
}

ws.send('123')