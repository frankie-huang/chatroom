import React, { Component, PropTypes } from 'react'
import Content from './Content.js'
import './chat.css'

class History extends Component {

    componentDidUpdate(prevProps, prevState) {
        let o = document.getElementById('history')
        console.log(o.scrollHeight)
        o.scrollTop = o.scrollHeight;
    }



    render () {
        let message = this.props.message||[]
        let messageList = message.map((value,index)=>{
            /**
             * value:{
             *  text:,
             *  time:,
             *  user:,
             *  status:,
             * }
             */
            let type = this.props.user==value.user?'right':'left'
            return <Content key={index} type={type} data={value} />
        })

        return (
            <div id='history' className="history">
                {messageList}
            </div>
        )
    }
}

History.propTypes = {
    message:PropTypes.array.isRequired,
    user:PropTypes.string.isRequired,
}

export default History