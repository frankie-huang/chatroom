import React, { Component, PropTypes } from 'react'
import './userlist.css'

class UserItem extends Component {
    render () {
        return (
            <div className='useritem'>
                <div className='usericon'></div>
                <h4 className='user-name'>{this.props.user.name}</h4>
            </div>
        )
    }
}

UserItem.propTypes = {
    user:PropTypes.object.isRequired,
}

export default UserItem