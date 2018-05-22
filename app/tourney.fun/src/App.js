import React, { Component } from 'react';
import { Button, Nav, Navbar, NavItem } from 'react-bootstrap'
import logo from './image820.png'
import './App.css'
import Config from './config.js'

import Submit from './Submit.js'
import Admin from './Admin.js'
import TourneyPanel from './TourneyPanel.js'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      doSubmit: false,
      doAdmin: false,
      doAbout: false,
      location: '',
      lat: '',
      lng: '',
      tz: '',
      tourneys: null,
      currentTime: '',
      currentDayOfWeek: 1,
      seeMore: false
    }
    this.ToggleSubmit = this.ToggleSubmit.bind(this)
    this.ToggleAdmin = this.ToggleAdmin.bind(this)
    this.ToggleAbout = this.ToggleAbout.bind(this)
    this.HandleSeeMore = this.HandleSeeMore.bind(this)
    this.HandleGoHome = this.HandleGoHome.bind(this)
  }

  componentWillMount() {
    let geo = navigator.geolocation
    geo.getCurrentPosition((pos) => {
      console.log(pos.coords.latitude)
      console.log(pos.coords.longitude)
      fetch(Config.api.url+'/tournaments/'+pos.coords.latitude+'/'+pos.coords.longitude,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json'
          }
        }
      )
      .then((result) => { return result.json() })
      .then((resultJson) => {
        if (typeof resultJson.city.name !== 'undefined') {
          let locale = resultJson.city.name +', '+resultJson.city.country
          this.setState({
            location: locale,
            tz: resultJson.tz,
            currentTime: resultJson.localDate,
            tourneys: resultJson.tourneys,
            currentDayOfWeek: resultJson.currentDayOfWeek
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
      this.setState({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      })
    })
  }

  ToggleAbout() {
    this.setState({
      doAbout: !this.state.doAbout,
      doAdmin: false,
      doSubmit: false,
    })
  }

  ToggleSubmit() {
    this.setState({
      doSubmit: !this.state.doSubmit,
      doAdmin: false,
      doAbout: false,
    })

  }

  ToggleAdmin() {
    this.setState({
      doAdmin: !this.state.doAdmin,
      doSubmit: false,
      doAbout: false
    })
  }

  HandleSeeMore() {
    this.setState({
      seeMore: true
    })
  }

	HandleGoHome() {
    this.setState({
      doAdmin: false,
      doSubmit: false,
      doAbout: false,
    })
	}

  render() {
    console.log(this.state.tourneys)
    return (
      <div className="App">
        <Navbar inverse collapseOnSelect fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <img src={logo} className="App-logo" alt="logo" onClick={this.HandleGoHome} />
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
                <Nav>
                  <NavItem>
                    <input placeholder="search" />&nbsp;<Button bsSize="small">Search</Button>
                  </NavItem>
                </Nav>
                <Nav pullRight>
                  <NavItem onClick={this.ToggleAbout} eventKey={3}>
                    About
                  </NavItem>
                  <NavItem onClick={this.ToggleSubmit} eventKey={1}>
                    Submit
                  </NavItem>
                  <NavItem onClick={this.ToggleAdmin} eventKey={2}>
                    Admin
                  </NavItem>
                </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="mainContainer">
          <div>
            <span>A crowd sourced international database of tournaments near you.</span>
          </div>
          {this.state.doSubmit &&
            <Submit />
          }
          {this.state.doAdmin && 
            <Admin />
          }
          {!this.state.doSubmit && !this.state.doAdmin && !this.state.doAbout &&
            <div>
              <div className="location_area">
                <div>
                  <span sm={2}>
                    Your approximate location: {this.state.location}
                  </span>
                </div>
                <div>
                  <span>
                    Local Time: {this.state.currentTime}
                  </span>
                  <span>
                    Timezone: {this.state.tz}
                  </span>
                </div>
              </div>
              <div className="todays_tourney_header">
                <h4>Events <span style={{color: 'red', fontWeight: 'bold'}}>TODAY</span> within 10 Km of your location</h4>
              </div>
              <div className="tourney_area">
                {this.state.tourneys && this.state.tourneys.today.map((tourney) =>
                  {
                    return(
                      <TourneyPanel tourney={tourney} />
                    )
                  })
                }
                {(!this.state.tourneys || this.state.tourneys.today.length === 0) &&
                  <div>
                    <span>No events found</span>
                  </div>
                }
              </div>
              <div className="todays_tourney_header">
                <h4>Events <span style={{color: 'red', fontWeight: 'bold'}}>TOMORROW</span> within 10 Km of your location</h4>
              </div>
              <div className="tourney_area">
                {this.state.tourneys && this.state.tourneys.tomorrow.map((tourney) =>
                  {
                    return(
                      <TourneyPanel tourney={tourney} />
                    )
                  })
                }
                {(!this.state.tourneys || this.state.tourneys.tomorrow.length === 0) &&
                  <div>
                    <span>No events found</span>
                  </div>
                }
              </div>
              <div>
                {!this.state.seeMore &&
                  <Button bsStyle="success" onClick={this.HandleSeeMore}>See more</Button>
                }
                {this.state.seeMore &&
                  <div>
                    <div className="others_tourney_header">
                      <h4>Events <span style={{color: 'red', fontWeight: 'bold'}}>OTHER Days</span> within 10 Km of your location</h4>
                    </div>
                    <div className="tourney_area">
                      {this.state.tourneys && this.state.tourneys.other.map((tourney) =>
                        {
                          return(<TourneyPanel tourney={tourney} />)
                        })
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default App;
