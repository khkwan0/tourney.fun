import React, { Component } from 'react';
import { Glyphicon, Button, Nav, Navbar, NavItem, NavDropdown } from 'react-bootstrap'
import logo from './image820.png'
import './App.css'
import Config from './config.js'

import Submit from './Submit.js'
import Admin from './Admin.js'
import TourneyPanel from './TourneyPanel'
import TourneyDetails from './TourneyDetails'
import LoginPanel from './LoginPanel'

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
      seeMore: false,
      selectedId: null,
      showLogin: false,
      isLoggedIn: false,
      bkgdImg: null
    }
    this.ToggleSubmit = this.ToggleSubmit.bind(this)
    this.ToggleAdmin = this.ToggleAdmin.bind(this)
    this.ToggleAbout = this.ToggleAbout.bind(this)
    this.HandleSeeMore = this.HandleSeeMore.bind(this)
    this.HandleGoHome = this.HandleGoHome.bind(this)
    this.SelectEvent = this.SelectEvent.bind(this)
    this.CloseDetails = this.CloseDetails.bind(this)
    this.ToggleLogin = this.ToggleLogin.bind(this)
    this.HandleLogout = this.HandleLogout.bind(this)
    this.UpdateTime = this.UpdateTime.bind(this)
    this.days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    this.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  }

  componentDidMount() {
    setInterval(this.UpdateTime, 60000)
  }

  ToggleLogin() {
    console.log('toggle')
    this.setState({
      showLogin: !this.state.showLogin
    })
  }

  HandleLogout() {
    this.setState({
      isLoggedIn: false
    })
  }

  UpdateTime() {
    let d = new Date()
    let hour = d.getHours()
    let ampm = 'am'
    if (hour === 0) hour = 12
    if (hour > 12) {
      hour -= 12
      ampm = 'pm'
    }
    let minute = d.getMinutes()
    if (minute < 10) {
      minute = '0' + minute.toString()
    }
    let dateString = this.days[d.getDay()] + ' ' + this.months[d.getMonth()] + ' ' + d.getDate() + ' ' + hour + ':' + minute + ' ' + ampm
    this.setState({
      currentTime: dateString
    })
  }

  componentWillMount() {
    let geo = navigator.geolocation
    geo.getCurrentPosition((pos) => {
      /*
      console.log(pos.coords.latitude)
      console.log(pos.coords.longitude)
      */
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
      seeMore: !this.state.seeMore
    })
  }

	HandleGoHome() {
    this.setState({
      doAdmin: false,
      doSubmit: false,
      doAbout: false,
    })
	}
  
  SelectEvent(eventId) {
    console.log(eventId)
    this.setState({
      selectedId: eventId
    })
  }

  CloseDetails() {
    this.setState({
      selectedId: null
    })
  }

  render() {
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
              <NavItem disabled>
                <span className="localdate">{this.state.currentTime} {this.state.tz}</span>
              </NavItem>
            </Nav>
            <Nav pullRight>
              <NavItem>
                <Glyphicon glyph="search" />
              </NavItem>
              <NavItem onClick={this.ToggleAbout} eventKey={3}>
                About
              </NavItem>
              <NavItem onClick={this.ToggleSubmit} eventKey={1}>
                Submit
              </NavItem>
              <NavItem className="officiallogin" onClick={this.ToggleLogin} eventKey={2}>
                Event Offical Login
              </NavItem>
              {this.state.isLoggedin &&
                <NavItem onClick={this.HandleLogout}>
                  Logout
                </NavItem>
              }
              {this.state.isLoggedIn &&
                <NavItem onClick={this.ToggleAdmin}>
                  Admin
                </NavItem>
              }
              <NavDropdown title="Contact Us" id="contact">
                <div className="contactarea">
                  For information, questions, or comments, please contact:
                  <div>
                    <span className="email">khkwan0@gmail.com</span>
                  </div>
                </div>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Navbar inverse fixedBottom>
            <Nav>
              <NavItem disabled><span className="location_area">Copyright 2018</span></NavItem>
            </Nav>
            <Nav pullRight>
              <NavItem disabled>
                <span className="location_area">Your approximate location: {this.state.location}</span>
              </NavItem>
            </Nav>
        </Navbar>
        {this.state.showLogin &&
          <LoginPanel closeLogin={this.ToggleLogin} />
        }
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
                  <span>
                  </span>
                </div>
              </div>
              <div className="todays_tourney_header">
                <h4>Events <span style={{color: 'red', fontWeight: 'bold'}}>TODAY</span> within 10 Km of your location</h4>
              </div>
              <div className="tourney_area">
                {this.state.tourneys && this.state.tourneys.today.map((tourney, index) =>
                  {
                    return(
                      <div key={index}>
                        <TourneyPanel tourney={tourney} showInfo={this.SelectEvent} />
                        {(this.state.eventId === tourney._id) &&
                          <TourneyDetails tourney={tourney} closeModal={this.CloseDetails} />
                        }
                      </div>
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
                {this.state.tourneys && this.state.tourneys.tomorrow.map((tourney, index) =>
                  {
                    return(
                      <div key={index}>
                        <TourneyPanel key={index} tourney={tourney} showInfo={this.SelectEvent} />
                        {(this.state.selectedId === tourney._id) &&
                          <TourneyDetails tourney={tourney} closeModal={this.CloseDetails} />
                        }
                      </div>
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
                  <div className="seemorebutton">
                    <Button bsStyle="success" onClick={this.HandleSeeMore}>See more</Button>
                  </div>
                }
                {this.state.seeMore && 
                  <div className="seemorebutton">
                    <Button bsStyle="success" onClick={this.HandleSeeMore}>See Less</Button>
                  </div>
                }
                {this.state.seeMore &&
                  <div>
                    <div className="others_tourney_header">
                      <h4>Events <span style={{color: 'red', fontWeight: 'bold'}}>OTHER Days</span> within 10 Km of your location</h4>
                    </div>
                    <div className="tourney_area">
                      {this.state.tourneys && this.state.tourneys.other.map((tourney, index) =>
                        {
                          return(
                            <div key={index}>
                              <TourneyPanel key={index} tourney={tourney} showInfo={this.SelectEvent} />
                              {(this.state.selectedId === tourney._id) &&
                                <TourneyDetails tourney={tourney} closeModal={this.CloseDetails} />
                              }
                            </div>
                          )
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
