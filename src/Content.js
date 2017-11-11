import React, { Component, PropTypes } from 'react'

class Content extends Component {
    render () {
        let side = {
            left:this.props.type=="right"?'50%':'10%'
        }
        let usnClass = this.props.type=='left'?'username-left':'username-right'
        let float = this.props.type=='right'?{float:'right'}:{}
        return (
            <div className='content' style={side}>
                <div className='content-title'>
                    <div className='user-icon' style={float}></div>
                    <h4 className={usnClass}>{this.props.data.user}</h4>
                </div>
                <div className="history-content" >
                    <h4 className='content-text'>{this.props.data.text}</h4>
                </div>
            </div>
        )
    }
}

Content.propTypes = {
    type:PropTypes.string.isRequired,//决定左或者右
    data:PropTypes.object.isRequired,//内容
    /*
    data:{
        text:,
        status:
    }
    */
}

export default Content