import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Socket from './Socket.js'
import Login from './login'

class App extends Component {
  
  constructor(props){
    super(props)
    // this.socket = new WebSocket("wss://myafei.cn:19911");
    // this.socket.onmessage = this.onReceive.bind(this)
    this.socket = new Socket("wss://myafei.cn:19911",this.onReceive.bind(this));
    this.state = {
      data:''
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


  render() {
    return (
      <div className="App">
        <Login />
      </div>
    );
  }
}

export default App;
