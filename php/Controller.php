<?php
header('Content-type:text/json');

$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

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
    $get_user = getByUid($post['u_id']);
    if (!password_verify($post['password'], $get_user['password'])) {
        ret_status($return, -2, '密码错误');
    }
    session_start();
    $_SESSION['u_id']=$get_user['u_id'];
    if ($get_weight!=false) {
        $_SESSION['weight']=$get_weight;
    } else {
        $_SESSION['weight']=0;
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
    ret_status($return);
    session_write_close();
}

function register($post)
{
    session_start();
    if (empty($post['username'])) {
        ret_status($return, -1, '用户名为空');
    }
    $get_user = getByUserName($post['username']);
    if ($get_user!=false) {
        ret_status($return, -1, '用户名已被注册');
    }
    if (!isset($_SESSION['authcode'])||strlen($_SESSION['authcode'])<4) {
        ret_status($return, -2, '验证码过期');
    }
    if (strtolower($post['CaptchaCode'])!=$_SESSION['authcode']) {
        ret_status($return, -3, '验证码错误');
    }
    $inactivated_users = M('inactivated_users');
    $seed = mt_rand();
    $data=array(
        'username'=>$post['username'],
        'email'=>$post['email'],
        'password'=>password_hash($post['password'], PASSWORD_BCRYPT),
        'sex'=>$post['sex'],
        'register_time'=>date('Y/m/d H:i:s'),
        'seed'=>$seed
    );
    $res = $inactivated_users->add($data);
    if ($res===false) {
        ret_status($return, -1, '注册失败，数据库插入数据出错');
    }
    $_SESSION['tmp_username']=$post['username'];
    $_SESSION['tmp_email']=$post['email'];
    $return['id']=$res;
    ret_status($return);
}

?>