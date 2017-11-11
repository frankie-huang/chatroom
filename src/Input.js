import React, { Component, PropTypes } from 'react'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import './chat.css'
import Button from 'react-bootstrap/lib/Button'

class Input extends Component {
    constructor(props){
        super(props);
        this.state = {
            text:""
        }
    }

    handleKey(e){
        if (e.keyCode==13){
            this.setState({
                text:e.target.value
            })
            this.handleCommit()
        }
    }

    handleCommit(){
        if (this.state.text=="")
            return
        this.props.sendMessage(this.state.text)
        this.setState({
            text:""
        })
    }

    handleChange(e){
        if (e.target.value=='\n')
            return 
        this.setState({
            text:e.target.value
        })
    }

    render () {
        return (
            <div className="input">
                <FormGroup className="input-container" controlId="textarea">
                    <FormControl 
                    ref='input-area'
                    onKeyDown={this.handleKey.bind(this)}
                    onChange={this.handleChange.bind(this)}
                    className="input-area" componentClass="textarea" placeholder="输入内容" 
                    value={this.state.text}
                    bsSize='lg'/>
                </FormGroup>
                <div className='commit'>
                    <Button
                    onClick={this.handleCommit.bind(this)} className='commit-button' block={true} bsStyle='success'>发送</Button>
                </div>
            </div>
        )
    }
}

Input.propTypes = {
    sendMessage:PropTypes.func.isRequired,
}

export default Input