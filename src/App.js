import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Socket from './Socket.js'
import Login from './login'
import UserList from './UserList'
import Chat from './Chat'
import Sender from './newSender'


function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
  };
  

class App extends Component {
  
  constructor(props){
    super(props)
    // this.socket = new WebSocket("wss://myafei.cn:19911");
    // this.socket.onmessage = this.onReceive.bind(this)
    // this.socket = new Socket("wss://myafei.cn:19911",this.onReceive.bind(this));
    this.state = {
      user:{
        user_id:'1',
        name:'1'
      },
      accessToken:'',
      message:[],
      tab:1,
      userList:[]
    }
  }
  
  onReceive(data){
    res = JSON.parse(data.data)
    if (res.type==='roomUserResponse'){
      if (res.status==1){
        this.setState({
          userList:res.uerList
        })
      } else {
        alert(res.error)
      }
    }
    if (res.type==='sendResponse'){
      if (res.status==1){
        let message = this.state.message;
        for (let i=length(message)-1;i>=length(message);i--)
          if (message[i].id==res.id){
            message[i].status = 'success'
            break;
          }
        this.setState({
          message:message
        })
      } else {
        let message = this.state.message;
        for (let i=length(message)-1;i>=length(message);i--)
          if (message[i].id==res.id){
            message[i].status = 'fail'
            break;
          }
        this.setState({
          message:message
        })
      }
    }
    if (res.type==='newRoomData'){
      this.setState({
        data:res.data
      })
    }
  }

  sendData(data){
    // this.socket.send(data)
  }

  sendMessage(data){
    let typeList = ['','room','']
    let mes = {
      user:this.state.user.name,
      text:data,
      time:new Date(),
      status:'success'
    }
    let re_mes = {
      user:'2',
      text:"see:"+data,
      time:new Date(),
      status:'success'
    }
    let messageList = this.state.message;
    messageList.push(mes)
    messageList.push(re_mes)
    this.setState({
      message:messageList
    })

    //send message to server
    let request = {
      func:'send',
      type:typeList[this.state.tab],
      time:new Date().getTime(),
      accessToken:this.state.accessToken,
      user:this.state.user.user_id,
      content:data,
      id:generateUUID()
    }
    this.sendData(request)
  }

  getUserList(data){
    this.setState({
      tab:data.tab
    })
    data.user = this.state.user.user_id
    data.accessToken = this.state.accessToken
    this.sendData(data)
  }

  render() {
    let message = this.state.message;
    let main = <div className="main">
      <UserList userList={[]} getUserList={this.getUserList.bind(this)}/>
      <Chat message={message} user={'1'} sendMessage={this.sendMessage.bind(this)}/>
    </div>
    return (
      <div className="App">
        {main}
      </div>
    );
  }
}

export default App;
