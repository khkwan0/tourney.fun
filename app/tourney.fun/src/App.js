import React, { Component } from 'react';
import { Button, Nav, Navbar, NavItem } from 'react-bootstrap'
import logo from './image820.png'
import './App.css'

import Submit from './Submit.js'
import Admin from './Admin.js'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      doSubmit: false,
      doAdmin: false

    }
    this.ToggleSubmit = this.ToggleSubmit.bind(this)
    this.ToggleAdmin = this.ToggleAdmin.bind(this)
  }

  componentWillMount() {
    let geo = navigator.geolocation
    geo.getCurrentPosition((pos) => {
      console.log(pos.coords.latitude)
      console.log(pos.coords.longitude)
    })
  }

  ToggleSubmit() {
    this.setState({
      doSubmit: !this.state.doSubmit,
      doAdmin: false
    })

  }

  ToggleAdmin() {
    this.setState({
      doAdmin: !this.state.doAdmin,
      doSubmit: false
    })
  }

  render() {
    return (
      <div className="App">
        <Navbar inverse collapseOnSelect fixedTop className="navbar">
          <Navbar.Header>
            <Navbar.Brand>
              <img src={logo} className="App-logo" alt="logo" />
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Collapse>
                <Nav pullRight>
                  <NavItem>
                    <input placeholder="search" />&nbsp;<Button bsSize="small">Search</Button>
                  </NavItem>
                  <NavItem onClick={this.ToggleSubmit} eventKey={4}>
                    Submit
                  </NavItem>
                  <NavItem onClick={this.ToggleAdmin} eventKey={6}>
                    Admin
                  </NavItem>
                </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="mainContainer">
          {this.state.doSubmit &&
            <Submit />
          }
          {this.state.doAdmin && 
            <Admin />
          }
        </div>
      </div>
    );
  }
}

export default App;
