<?php
require_once "Model/PDO_MySQL.class.php";
require_once "Model/config.php";

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

$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

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

//$return['status']：0为无错误，1为发送消息成功（反馈），100为身份验证成功，-100为被异地登录挤退，-1为出现错误，或-2（见下一行注释）
//$return['status']为-2时：当前时间和redis设置的live_time相差超过30秒，可能是服务器延迟，更有可能是当前用户登录失效
function callbackNewData($connect, $data)
{
    global $ws_worker;
    global $redis;
    $msg=json_decode($data);
    $connect->send("现在时间是：".$data);
    // if ($msg->status==0) {
        
    // } elseif ($msg->status==1) {
        
        // for ($i=0; $i<$sender_group_number; $i++) {
        //     if (isset($ws_worker->connections[$sender_group[$i]])) {
        //         send_message($ws_worker->connections[$sender_group[$i]], $return, 1, '发送成功');
        //     }
        // }
    // }
}

function callbackConnectClose($connect)
{
    $connect->send('88');
}

function send_message($connect, &$return, $status = 0, $error = '')
{
    $return['status']=$status;
    $return['error']=$error;
    $connect->send(json_encode($return));
}

function getByUid($u_id)
{
    $users = M("users");
    $where['u_id'] = $u_id;
    $result = $users->where($where)->select();
    if ($result==false) {
        return false;
    } else {
        return $result[0];
    }
}

function getByUserName($username)
{
    $users = M("users");
    $where['username'] = $username;
    $result = $users->where($where)->select();
    if ($result==false) {
        return false;
    } else {
        return $result[0];
    }
}
