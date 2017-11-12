import React, { Component, PropTypes } from 'react'
import './userlist.css'
import UserItem from './UserItem'


class UserList extends Component {

    constructor(props){
        super(props);
        this.state = {
            tab:1
        }
    }

    handleChangeTab(key){
        let funcList = ['','getRoomUser','']
        let data = {
            func:funcList[this.state.tab],
            tab:this.state.tab
        }
        this.props.getUserList(data)
        this.setState({
            tab:key
        })
    }

    render () {
        let user = this.props.userList||[]
        let userList = user.map((value,index)=>{
            return <UserItem user = {value} key={index} />
        })

        let tabList = ['好友列表','聊天室','好友管理']
        let tabs = tabList.map((value,index)=>{
            let selected = this.state.tab==index?'tab selected':'tab';
            let key = index;
            return <div key={index} className={selected} onClick={this.handleChangeTab.bind(this,key)}>{value}</div>
        })

        return (
            <div className="user-list">
                <div className='user-list-header'>
                    {tabs}
                </div>
                <div className='user-list-body'>
                    {userList}
                </div>
            </div>
        )
    }
}

UserList.propTypes = {
    userList:PropTypes.array.isRequired,
    getUserList:PropTypes.func.isRequired,
}

export default UserList