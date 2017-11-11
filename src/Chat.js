import React, { Component, PropTypes } from 'react'
import History from './History'
import Input from './Input'
import './chat.css'

class Chat extends Component {
    render () {
        return (
            <div className="chat">
                <div className='chat-header'>
                <h3 className='chat-header-text'>聊天室</h3>
                </div>
                <History message={this.props.message} user={this.props.user}/>
                <Input sendMessage={this.props.sendMessage}/>
            </div>
        )
    }
}

Chat.propTypes = {
    message:PropTypes.array.isRequired,//message list
    user:PropTypes.string.isRequired,//current user
    sendMessage:PropTypes.func.isRequired,
}

export default Chat