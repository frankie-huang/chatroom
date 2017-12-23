<?php
header('Content-type:text/json');

$redis = new Redis();
$redis->connect('127.0.0.1', 6380);

//检测是否登录
function is_login($post)
{
    global $redis;
    session_start();
    if (isset($_SESSION['u_id'])) {
        $get_user=getByUid($_SESSION['u_id']);
        if ($get_user==false) {
            ret_status($return, -1, 'session所指用户不存在');
        }
        $return=$get_user;
        unset($return['password']);
        //检查是否有新消息
        $where['to_id']=$_SESSION['u_id'];
        $where['is_read']=false;
        $res=M('message')->where($where)->count('content');
        $return['number']=$res;
        $return['token']=mt_rand();
        $redis->set('user_token'.$get_user['u_id'], $return['token']);
        $return['ip']=get_client_ip(0, true);
        $return['weight']=$_SESSION['weight'];
        ret_status($return);
    }
    ret_status($return, -2, '未登录');
}

function login($post)
{
    global $redis;
    $get_user = getByUserName($post['usn']);
    if ($get_user==false) {
        ret_status($return, 0, '用户不存在');
    }
    if (!password_verify($post['password'], $get_user['password'])) {
        ret_status($return, 0, '密码错误');
    }
    session_start();
    $_SESSION['u_id']=$get_user['u_id'];
    $return=$get_user;
    unset($return['password']);
    $return['accessToken']=mt_rand();
    $redis->set('accessToken'.$get_user['u_id'], $return['accessToken']);
    ret_status($return);
}

function signin($post)
{
    session_start();
    global $redis;
    if (empty($post['usn'])) {
        ret_status($return, 0, '用户名不能为空');
    }
    $get_user = getByUserName($post['usn']);
    if ($get_user!=false) {
        ret_status($return, 0, '用户名已被注册');
    }
    $data=array(
        'nick'=>$post['usn'],
        'password'=>password_hash($post['password'], PASSWORD_BCRYPT),
        'head'=>'public/img/head/default_head.jpg',
    );
    $res = M('users')->add($data);
    if ($res===false) {
        ret_status($return, 0, '注册失败，数据库插入数据出错');
    }
    $_SESSION['u_id']=$res;
    $return['u_id']=$res;
    $return['accessToken']=mt_rand();
    $redis->set('accessToken'.$res, $return['accessToken']);
    ret_status($return);
}

function getByUid($u_id)
{
    $users = M("users");
    $where['u_id'] = $u_id;
    $result = $users->where($where)->find();
    if ($result==false) {
        return false;
    } else {
        return $result;
    }
}

function getByUserName($username)
{
    $users = M("users");
    $where['nick'] = $username;
    $result = $users->where($where)->find();
    if ($result==false) {
        return false;
    } else {
        return $result;
    }
}

function getTagByLabel($label, $user_id){
    $tag_table = M('tag');
    $where['u_id'] = $user_id;
    $where['label'] = $label;
    $result = $tag_table->where($where)->find();
    if ($result == false) {
        return false;
    } else {
        return $result;
    }
}

//AJAX返回
function ret_status(&$return, $status = 1, $error = '')
{
    $return['status']=$status;
    $return['error']=$error;
    exit(json_encode($return));
}
