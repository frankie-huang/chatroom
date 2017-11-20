<?php
header("Access-Control-Allow-Origin: *");
require_once "../Model/PDO_MySQL.class.php";
require_once "../Model/config.php";

require_once "Controller.php";

$post = I('post.');

$function_name = $post['func'];

$function_name($post);

?>