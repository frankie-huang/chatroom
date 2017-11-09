import React, {Component} from 'react';
import './signin.css';
import PropTypes from 'prop-types';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Sender from './newSender';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            active: "login",
            usn:""
        }
    }

    receivedData(data) {
        if (data.status == 1) {
            this.props.commit(this.state.usn);
            // this.props.history.push("./home/"+this.state.usn);
        } else {
            alert(data.error);
        }
    }

    commit(type,usn,pw){
        var sender = new Sender();
        var data = {
            ins: type,
            name: usn,
            password: pw
        }
        sender.getData(data, this.receivedData.bind(this));
        this.setState({
            user:usn
        })
    }

    submit(type) {
        var event = window.event || arguments.callee.caller.arguments[0];
        var usn = this.refs.userName.value;
        var pw = this.refs.passWord.value;
        if (type === 'login') {
            if (usn !== "" && pw !== "") {
                this.commit('login', usn, pw);
                event.preventDefault();
                event.stopPropagation();
            }
        } else {
            var pw2 = this.refs.passWord2.value;
            if (pw !== pw2) {
                alert("两次密码不相同，请重新输入");
            } else {
                if (usn !== "" && pw !== "") {
                    this.commit('register', usn, pw);
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
    }

    handleSelect(e) {
        this.setState({active: e})
    }

    render() {
        var pannel = <div className="form-signin">
            <label htmlFor="inputEmail" className="sr-only">UserName</label>
            <input
                ref="userName"
                className="form-control"
                placeholder="用户名"
                required
                autoFocus></input>
            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <input
                ref="passWord"
                type="password"
                id="inputPassword"
                className="form-control"
                placeholder="密码"
                required></input>
            <button
                className="submit-button btn btn-lg btn-primary btn-block"
                onClick={this
                .submit
                .bind(this, 'login')}>登录</button>
        </div>;
        if (this.state.active !== 'login') 
            pannel = <div className="form-signin">
                <label htmlFor="inputEmail" className="sr-only">UserName</label>
                <input
                    ref="userName"
                    className="form-control"
                    placeholder="用户名"
                    required
                    autoFocus></input>
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input
                    ref="passWord"
                    type="password"
                    id="inputPassword"
                    className="form-control"
                    placeholder="密码"
                    required></input>
                <label htmlFor="inputPassword2" className="sr-only">Password</label>
                <input
                    ref="passWord2"
                    type="password"
                    id="inputPassword2"
                    className="form-control"
                    placeholder="重复输入密码"
                    required></input>
                <button
                    className="submit-button btn btn-lg btn-primary btn-block"
                    onClick={this
                    .submit
                    .bind(this, 'register')}>注册</button>
            </div>;
        return (
            <div className="container">
                <Nav
                    bsStyle="tabs"
                    justified
                    activeKey={this.state.active}
                    onSelect={this
                    .handleSelect
                    .bind(this)}>
                    <NavItem eventKey={'login'}>登录</NavItem>
                    <NavItem eventKey={'register'}>注册</NavItem>
                </Nav>
                {pannel}
            </div>

        );
    }
}

Login.propTypes = {
    commit: PropTypes.func.isRequired
};

export default Login;
