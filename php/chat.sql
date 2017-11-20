CREATE DATABASE `chat` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

use chat;

CREATE TABLE users( 
  `u_id` int(10) not null auto_increment primary key COMMENT "user_id，用户ID，用户唯一标识符", 
  `nick` varchar(20) not null COMMENT "昵称/用户名",
  `password` varchar(256) not null COMMENT "密码",
  `head` text not null COMMENT "头像图片地址"
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE message(
  `id` int(100) not null auto_increment primary key,
  `from` int(10) not null COMMENT "消息发送者",
  `content` text not null COMMENT "消息内容",
  `to` int(10) not null COMMENT "消息接收者",
  `time` datetime not null COMMENT "发送时间",
  FOREIGN KEY (`from`) REFERENCES `users` (`u_id`) ON DELETE CASCADE,
  FOREIGN KEY (`to`) REFERENCES `users` (`u_id`) ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE room_message(
  `id` int(100) not null auto_increment primary key,
  `from` int(10) not null COMMENT "消息发送者",
  `content` text not null COMMENT "消息内容",
  `time` datetime not null COMMENT "发送时间",
  FOREIGN KEY (`from`) REFERENCES `users` (`u_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 好友标签分组
CREATE TABLE tag(
  `id` int(10) not null auto_increment primary key,
  `u_id` int(10) not null COMMENT "用户id",
  `label` text not null COMMENT "好友标签内容",
  FOREIGN KEY (`u_id`) REFERENCES `users` (`u_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 用于存储好友关系
CREATE TABLE friend(
  `from` int(10) not null COMMENT "发起好友请求的人",
  `to` int(10) not null COMMENT "接受好友请求的人",
  `tag_id` int(10) not null COMMENT "好友标签", 
  FOREIGN KEY (`from`) REFERENCES `users` (`u_id`) ON DELETE CASCADE,  
  FOREIGN KEY (`to`) REFERENCES `users` (`u_id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 用于存储好友请求
CREATE TABLE tmp_friend(
  `from` int(10) not null COMMENT "发起好友请求的人",
  `to` int(10) not null COMMENT "接到好友请求的人",
  `tag_id`  int(10) not null COMMENT "好友标签", 
  FOREIGN KEY (`from`) REFERENCES `users` (`u_id`) ON DELETE CASCADE,  
  FOREIGN KEY (`to`) REFERENCES `users` (`u_id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




-- 用户注册后加一个默认标签“我的好友”
-- 用户加好友后默认标签分组是“我的好友”
-- 增加标签时检测同一用户是否拥有相同内容的好友标签
