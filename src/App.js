import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Socket from './Socket.js'
import Login from './login'
import UserList from './UserList'
import Chat from './Chat'

class App extends Component {
  
  constructor(props){
    super(props)
    // this.socket = new WebSocket("wss://myafei.cn:19911");
    // this.socket.onmessage = this.onReceive.bind(this)
    // this.socket = new Socket("wss://myafei.cn:19911",this.onReceive.bind(this));
    this.state = {
      user:"1",
      message:[
        {
          text:'123',
          user:'1',
        },
        {
          text:'123',
          user:'2',
        },
        {
          text:'123123',
          user:'1',
        }
      ]
    }
  }
  
  onReceive(data){
    this.setState({
      data:data.data
    })
  }

  sendData(data){
    this.socket.send(data)
  }

  sendMessage(data){
    let mes = {
      user:this.state.user,
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
  }


  render() {
    let message = this.state.message;
    let main = <div className="main">
      <UserList />
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
