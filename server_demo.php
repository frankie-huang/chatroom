<?php
require_once "Model/PDO_MySQL.class.php";
require_once "Model/config.php";

require_once "php/Controller.php";

require_once "workerman/Autoloader.php";
use Workerman\Worker;

// SSL context.
// $context = array(
//     'ssl' => array(
//         'local_cert'  => '/etc/nginx/CA/1_myafei.cn_bundle.crt',
//         'local_pk'    => '/etc/nginx/CA/2_myafei.cn.key',
//         'verify_peer' => false,
//     )
// );

$ws_worker = new Worker("websocket://0.0.0.0:19911");

// Enable SSL. WebSocket+SSL means that Secure WebSocket (wss://). 
// The similar approaches for Https etc.
// $ws_worker->transport = 'ssl';

// 1 processes
$ws_worker->count = 1;

// Emitted when new connection come
$ws_worker->onConnect = 'callbackConnect';
// Emitted when data received
$ws_worker->onMessage = 'callbackNewData';
// Emitted when connection closed
$ws_worker->onClose = 'callbackConnectClose';

// $redis = new Redis();
// $redis->connect('127.0.0.1', 6379);

//一共设置了多少个redis键
// $redis->set('connect_id'.$connect->id, $u_id);
// $redis->sAdd($u_id, $connect->id);
// $redis->sAdd("userList", $u_id);

// Run worker
Worker::runAll();

function callbackConnect($connect)
{
    $connect->onWebSocketConnect = function ($connect, $http_header) {
        // 可以在这里判断连接来源是否合法，不合法就关掉连接
        // $_SERVER['HTTP_ORIGIN']标识来自哪个站点的页面发起的websocket连接
        // if ($_SERVER['HTTP_ORIGIN']!='https://myafei.cn'&&$_SERVER['HTTP_ORIGIN'] != 'https://www.myafei.cn') {
        //     $connect->send("只接受来自myafei.cn站点的连接");
        //     $connect->close();
        // }
        // onWebSocketConnect 里面$_GET $_SERVER是可用的
        // var_dump($_GET, $_SERVER);
    };
}

function callbackNewData($connect, $data)
{
    global $ws_worker;
    global $redis;
    $post=json_decode($data, true);
    $post['connect'] = $connect;
    $function_name = $post['func'];
    $function_name($post);
}

function callbackConnectClose($connect)
{
    global $redis;
    global $ws_worker;
    $redis->sRem($redis->get('connect_id'.$connect->id), $connect->id);
    if ($redis->sCard($redis->get('connect_id'.$connect->id))==0) {
        $redis->sRem("userList", $redis->get('connect_id'.$connect->id));
    }
    $redis->delete('connect_id'.$connect->id);
    //发送新用户列表
    $return['type']='newRoomUser';
    $return['userList'] = $redis->sMembers("userList");
    $number_userList = $redis->sCard("userList");
    for($i=0;$i<$number_userList;$i++){
        $get_user = getByUid($return['userList'][$i]);
        if($get_user==false){
            unset($return['userList'][$i]);
            continue;
        }
        $return['userList'][$i] = array(
            'id'=>$return['userList'][$i],
            'name'=>$get_user['nick']
        );
    }
    foreach($ws_worker->connections as $connection)
    {
        send_message($connection, $return);
    }
}

function getRoomUser($post)
{
    global $redis;
    global $ws_worker;
    $connect = $post['connect'];
    $return['type']='roomUserResponse';
    $get_user=getByUid($post['user']);
    if ($get_user==false) {
        send_message($connect, $return, 0, '用户不存在');
        $connect->close();
    }
    if ($redis->get("accessToken".$post['user'])!=$post['accessToken']) {
        send_message($connect, $return, 0, '验证不通过');
        $connect->close();
    }
    $redis->set('connect_id'.$connect->id, $post['user']);
    $redis->sAdd($post['user'], $connect->id);
    $redis->sAdd("userList", $post['user']);
    $return['userList'] = $redis->sMembers("userList");
    $number_userList = $redis->sCard("userList");
    for($i=0;$i<$number_userList;$i++){
        // if($return['userList'][$i]==$post['user']){
        //     unset($return['userList'][$i]);
        //     continue;
        // }
        $get_user = getByUid($return['userList'][$i]);
        if($get_user==false){
            unset($return['userList'][$i]);
            continue;
        }
        $return['userList'][$i] = array(
            'id'=>$return['userList'][$i],
            'name'=>$get_user['nick']
        );
    }
    send_message($connect, $return);
    //发送新用户列表
    $return['type']='newRoomUser';
    foreach($ws_worker->connections as $connection)
    {
        send_message($connection, $return);
    }
}

function send($post){
    global $redis;
    global $ws_worker;
    $connect = $post['connect'];
    if($post['type']=="room"){
        $return['type']="sendResponse";
        $return['id']=$post['id'];
        $get_user=getByUid($post['user']);
        if ($get_user==false) {
            send_message($connect, $return, 0, '用户不存在');
            $connect->close();
        }
        if ($redis->get("accessToken".$post['user'])!=$post['accessToken']) {
            send_message($connect, $return, 0, '验证不通过');
            $connect->close();
        }
        $data = array(
            'from'=>$post['user'],
            'content'=>$post['content'],
            'time'=>date('Y-m-d H:i:s'),
        );
        M('room_message')->add($data);
        send_message($connect, $return);
        $message['type'] = "newRoomData";
        $message['data'] = array(
            'user_id'=>$post['user'],
            'user_name'=>$get_user['nick'],
            'text'=>$post['content'],
            'time'=>$data['time'],
        );
        foreach($ws_worker->connections as $connection)
        {
            send_message($connection, $message);
        }
    }
}

function send_message($connect, &$return, $status = 1, $error = '')
{
    $return['status']=$status;
    $return['error']=$error;
    $connect->send(json_encode($return));
}
