import React, { Component } from 'react'
import { FormControl, Modal, Button } from 'react-bootstrap'

class LoginPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      pwd: ''
    }
    this.HandleChangeEmail = this.HandleChangeEmail.bind(this)
    this.HandleChangePassword = this.HandleChangePassword.bind(this)
    this.Cancel = this.Cancel.bind(this)
  }

  HandleChangeEmail(event) {
    this.setState({
      email: event.target.value
    })
  }

  HandleChangePassword(event) {
    this.setState({
      pwd: event.target.value
    })
  }

  Cancel() {
    this.props.closeLogin()
  }

  render() {
    return(
      <div>
      <Modal show={true} onHide={this.props.closeLogin}>
          <Modal.Header closeButton>
            Event Official Login
          </Modal.Header>
          <div>
            <div className="emaillogin">
              <FormControl value={this.state.email} placeholder="Email" />
            </div>
            <div className="pwdlogin">
              <FormControl value={this.state.pwd} placeholder="Password" type="password" />
            </div>
          </div>
          <Modal.Footer>
            <Button bsStyle="success" onClick={this.HandleLogin}>Login</Button>
            <Button bsStyle="warning" onClick={this.Cancel}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default LoginPanel
