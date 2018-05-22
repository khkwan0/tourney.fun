import React, { Component } from 'react'
import { Button, Form, Col, ControlLabel, Checkbox, Radio, FormGroup, FormControl } from 'react-bootstrap'
import countries from 'countries-list'
import Calendar from 'react-calendar'
import Config from './config.js'
import Map from './Map.js'
import FileUpload from './FileUpload.js'

class Submit extends Component {

  static Format = ['Single Elimination', 'Double Elimination', 'Round Robin', 'Killer', 'Other']
  static Day = ['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  static Frequency = ['Weekly', 'Daily', 'Monthly', 'Once']
  static GameType = ['Game Type','8 Ball', '9 Ball', '10 Ball', 'Snooker','Other']

  constructor(props) {
    super(props)
    this.state = {
      venue: '',
      country: null,
      state: null,
      city: null,
      address: '',
      game: Submit.GameType[0],
      singles: true,
      format: Submit.Format[0],
      scotch: false,
      date: new Date(),
      day: Submit.Day[0],
      hour: 0,
      minute: 0,
      ampm: 1,
      frequency: Submit.Frequency[0],
      entryFee: 0,
      prizePool: 0,
      rules: '',
      notes: '',
      email: '',
      lat: null,
      lng: null,
      currency: null,
      stateList: null,
      cityList: null,
      countryList:countries.countries,
      phone: '',
      phonePrefix: null,
			websiteURL: ''
    }
    this.clearState = this.state
    this.GetCities = this.GetCities.bind(this)
    this.HandleChangeVenue = this.HandleChangeVenue.bind(this)
    this.HandleChangeCountry = this.HandleChangeCountry.bind(this)
    this.HandleChangeState = this.HandleChangeState.bind(this)
    this.HandleChangeCity = this.HandleChangeCity.bind(this)
    this.HandleChangeGameType = this.HandleChangeGameType.bind(this)
    this.HandleChangeFormat = this.HandleChangeFormat.bind(this)
    this.HandleChangeSingDoub = this.HandleChangeSingDoub.bind(this)
    this.HandleChangeScotch = this.HandleChangeScotch.bind(this)
    this.HandleChangeAddress = this.HandleChangeAddress.bind(this)
    this.HandleChangeDay = this.HandleChangeDay.bind(this)
    this.HandleChangeFrequency = this.HandleChangeFrequency.bind(this)
    this.HandleChangeHour = this.HandleChangeHour.bind(this)
    this.HandleChangeMinute = this.HandleChangeMinute.bind(this)
    this.HandleChangeAMPM = this.HandleChangeAMPM.bind(this)
    this.HandleChangeEntryFee = this.HandleChangeEntryFee.bind(this)
    this.HandleChangeRules = this.HandleChangeRules.bind(this)
    this.HandleChangeNotes = this.HandleChangeNotes.bind(this)
    this.HandleChangeEmail = this.HandleChangeEmail.bind(this)
    this.HandleChangePhone = this.HandleChangePhone.bind(this)
    this.HandleChangeDate = this.HandleChangeDate.bind(this)
    this.HandleRetrieveCoordinates = this.HandleRetrieveCoordinates.bind(this)
    this.HandleChangeWebSite = this.HandleChangeWebSite.bind(this)
    this.HandleSubmit = this.HandleSubmit.bind(this)

    this.countryList = []
    this.countryList.push(<option key="select" value="select">Country</option>)
    if (this.state.countryList) {
      for (var country in this.state.countryList) {
        this.countryList.push(<option key={country} value={country}>{this.state.countryList[country].name}</option>)
      }
    }

    this.stateList = []
    this.cityList = []
    this.hourList = []
    for (let i = 0; i < 12; i++) {
      let key = "hour"+i
      if (i === 0) {
        this.hourList.push(
          <option key={key} value={i}>12</option>
        )
      } else {
        this.hourList.push(
          <option key={key} value={i}>{i}</option>
        )
      }
    }

    this.minuteList = []
    for (let i=0; i< 60; i++) {
      let key = "minute"+i
      if (i<10) {
        this.minuteList.push(
          <option key={key} value={i}>0{i}</option>
        )
      } else {
        this.minuteList.push(
          <option key={key} value={i}>{i}</option>
        )
      }
    }
    
    this.dayList = []
    Submit.Day.forEach((day) => {
      this.dayList.push(<option key={day} value={Submit.Day[day]}>{day.toUpperCase()}</option>)
    })

    this.recurranceList = []
    for (var occurance in Submit.Frequency) {
      this.recurranceList.push(<option key={occurance} value={occurance}>{Submit.Frequency[occurance].toUpperCase()}</option>)
    }

    this.formatList = []
    Submit.Format.forEach((format) => {
      this.formatList.push(<option key={format} value={format}>{format}</option>)
    })

    this.gameTypeList = []
    Submit.GameType.forEach((gameType) => {
      this.gameTypeList.push(<option key={gameType} value={gameType}>{gameType}</option>)
    })
  }

  HandleSubmit() {
    let toSubmit = this.state
    delete toSubmit.stateList
    delete toSubmit.cityList
    delete toSubmit.countryList
    if (this.state.venue && this.state.email) {
      fetch(Config.api.url+'/submissions',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(toSubmit)
        }
      )
      .then((result) => { return result.json() })
      .then((resultJson) => {
        if (typeof resultJson._id !== 'undefined' && resultJson._id) {
          let resetState = this.clearState
          resetState.countryList = countries.countries
          this.setState(resetState)
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }

  HandleChangeVenue(event) {
    this.setState({
      venue: event.target.value
    })
  }

  HandleChangeCountry(event) {
    let currency = null
    if (typeof countries.countries[event.target.value].currency !== 'undefined') {
      currency = countries.countries[event.target.value].currency
    }
    let phonePrefix = null
    if (typeof countries.countries[event.target.value].phone !== 'undefined') {
      phonePrefix = countries.countries[event.target.value].phone
    }
    this.setState({
      country: event.target.value,
      currency: currency,
      phonePrefix: phonePrefix,
    }, ()=> {this.GetCities()})
    fetch(Config.api.url+'/getstates/'+event.target.value,
      {
        include: 'credentials',
        headers: {
          Accept: 'application/json'
        }
      }
    )
    .then((result) => { return result.json() })
    .then((resultJson) => {
      this.stateList = []
      resultJson.states.forEach((state) => {
        this.stateList.push(<option key={state} value={state}>{state}</option>)
      })
      this.setState({
        stateList: resultJson.states
      })
    })
    .catch((err) => {
    })
  }

  HandleChangeState(event) {
    this.setState({
      state: event.target.value
    },() => { this.GetCities()})
  }

  HandleChangeCity(event) {
    this.setState({
      city: event.target.value
    })
  }

  GetCities() {
    if (this.state.country && this.state.state) {
    fetch(Config.api.url+'/getcities/'+this.state.country+'/'+this.state.state,
      {
        include: 'credentials',
        headers: {
          Accept: 'application/json'
        }
      }
    )
    .then((result) => { return result.json() })
    .then((resultJson) => {
      if (resultJson.cities && resultJson.cities.length) {
        this.cityList = []
        resultJson.cities.forEach((city) => {
          let key = 'city'+city
          this.cityList.push(<option key={key} value={city}>{city}</option>)
        })
        this.setState({
          cityList: resultJson.cities
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
    }

  }

  HandleChangeGameType(event) {
    this.setState({
      gameType: event.target.value
    })
  }

  HandleChangeSingDoub(event) {
    let singles = true
    if (event.target.value === 'd') {
      singles = false
    }
    this.setState({
      singles: singles
    })
  }

  HandleChangeAddress(event) {
    this.setState({
      address: event.target.value
    })
  }

  HandleChangeScotch(event) {
    this.setState({
      scotch: event.target.checked
    })
  }

  HandleChangeFormat(event) {
    this.setState({
      format: event.target.value
    })
  }

  HandleChangeFrequency(event) {
    let freq = parseInt(event.target.value, 10)
    this.setState({
      frequency: freq
    })
  }

  HandleChangeDay(event) {
    this.setState({
      day: event.target.value
    })
  }

  HandleChangeHour(event) {
    this.setState({
      hour: event.target.value
    })
  }

  HandleChangeMinute(event) {
    this.setState({
      minute: event.target.value
    })
  }

  HandleChangeAMPM(event) {
    this.setState({
      ampm: event.target.value
    })
  }

  HandleChangeEntryFee(event) {
    this.setState({
      entryFee: event.target.value
    })
  }

  HandleChangeRules(event) {
    this.setState({
      rules: event.target.value
    })
  }

  HandleChangeNotes(event) {
    this.setState({
      notes: event.target.value
    })
  }

  HandleChangeEmail(event) {
    this.setState({
      email: event.target.value
    })
  }

  HandleChangeDate(date) {
    this.setState({
      date: date
    })
  }

  HandleChangePhone(event) {
    this.setState({
      phone: event.target.value
    })
  }

	HandleChangeWebSite(event) {
		this.setState({
			websiteURL: event.target.value
		})
	}

  HandleRetrieveCoordinates() {
    if (this.state.venue && this.state.address && this.state.country) {
      let searchTerm = this.state.venue + ','+this.state.address+','+this.state.country
      searchTerm = encodeURI(searchTerm)
      fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+searchTerm+'&key='+Config.Google.APIKEY,
        {
          method: 'GET'
        }
      )
      .then((result) => { return result.json() })
      .then((resultJson) => {
        this.setState({
          lat: resultJson.results[0].geometry.location.lat,
          lng: resultJson.results[0].geometry.location.lng,
        })
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }

  render() {

    return (
      <div>
        <Form horizontal>
          <FormGroup controlId="formHorVenue">
            <Col componentClass={ControlLabel} sm={2}>
              Venue
            </Col>
            <Col sm={6}>
              <FormControl type="text" placeholder="Venue (Required)" onChange={this.HandleChangeVenue} value={this.state.venue} />
            </Col>
          </FormGroup>
					<FormGroup controlId="formWebsite">
						<Col componentClass={ControlLabel} sm={2}>
							Website URL
						</Col>
						<Col sm={6}>
							<FormControl type="text" placeholder="Website URL" onChange={this.HandleChangeWebSite} value={this.state.websiteURL} />
						</Col>
					</FormGroup>
          <FormGroup controlId="formCountry">
            <Col componentClass={ControlLabel} sm={2}>
              Country 
            </Col>
            <Col sm={4}>
              <FormControl componentClass="select" placeholder="Country" onChange={this.HandleChangeCountry}>
                {this.countryList}
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup controlId="formState">
            <Col componentClass={ControlLabel} sm={2}>
              State/Province 
            </Col>
            <Col sm={4}>
              <FormControl componentClass="select" placeholder="State/Province" onChange={this.HandleChangeState}>
                {this.stateList}
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup controlId="formCity">
            <Col componentClass={ControlLabel} sm={2}>
              City 
            </Col>
            <Col sm={4}>
              <FormControl componentClass="select" placeholder="City" onChange={this.HandleChangeCity}>
                {this.cityList}
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup controlId="formAddress">
            <Col componentClass={ControlLabel} sm={2}>
              Street Address
            </Col>
            <Col sm={4}>
              <FormControl componentClass="textarea" placeholder="Address (Required)" value={this.state.address} onChange={this.HandleChangeAddress} />
            </Col>
          </FormGroup>
          <div>
            <Button onClick={this.HandleRetrieveCoordinates}>Retrieve Coordinates</Button>
          </div>
          {this.state.lat && this.state.lng &&
            <div>
              <div>
                Lat: {this.state.lat} Lng: {this.state.lng}
              </div>
              <div>
                <Map lat={this.state.lat} lng={this.state.lng} />
              </div>
            </div>
          }
          <FormGroup controlId="gameType">
            <Col componentClass={ControlLabel} sm={2}>
              Game Type
            </Col>
            <Col sm={4}>
              <FormControl componentClass="select" onChange={this.HandleChangeGameType}>
                {this.gameTypeList}
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup controlId="format">
            <Col componentClass={ControlLabel} sm={2}>
              Format
            </Col>
            <Col sm={4}>
              <FormControl componentClass="select" onChange={this.HandleChangeFormat}>
                {this.formatList}
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup controlId="formSingDoub">
            <Col smOffset={2}  sm={4}>
              <Radio defaultChecked name="singdoub" value="s" inline>Singles</Radio>{' '}
              <Radio name="singdoub" value="d" inline>Doubles</Radio>
            </Col>
          </FormGroup>
          <FormGroup controlId="scotch">
            <Col smOffset={2} sm={4}>
              <Checkbox onChange={this.HandleChangeScotch} inline>Scotch Doubles?</Checkbox>
            </Col>
          </FormGroup>
          <FormGroup controlId="formfreq">
            <Col componentClass={ControlLabel} sm={2}>
              Frequency
            </Col>
            <Col sm={4}>
              <FormControl componentClass="select" onChange={this.HandleChangeFrequency}>
                {this.recurranceList}
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup controlId="dayForm">
            <Col componentClass={ControlLabel} sm={2}>
              Starting Day
            </Col>
            {(this.state.frequency === Submit.Frequency.once) &&
              <Col sm={3}>
                <Calendar onChange={this.HandleChangeDate} value={this.state.date} />
              </Col>
            }
            {this.state.frequency !== Submit.Frequency.once &&
            <Col sm={2}>
              <FormControl componentClass="select" onChange={this.HandleChangeDay}>
                {this.dayList}
              </FormControl>
            </Col>
            }
            <Col sm={1}>@</Col>
            <Col sm={1}>
              <FormControl componentClass="select" onChange={this.HandleChangeHour}>
                {this.hourList}
              </FormControl>
            </Col>
            <Col sm={1}>
              <FormControl componentClass="select" onChange={this.HandleChangeMinute}>
                {this.minuteList}
              </FormControl>
            </Col>
            <Col sm={1}>
              <FormControl componentClass="select" onChange={this.HandleChangeAMPM}>
                <option value={1}>PM</option>
                <option value={0}>AM</option>
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup controlId="entryfeeform">
            <Col componentClass={ControlLabel} sm={2}>
              Entry Fee
            </Col>
            <Col sm={1}>
              <FormControl type="number" onChange={this.HandleChangeEntryFee} placeholder="0.00" value={this.state.entryFee} />
            </Col>
            {typeof this.state.currency !== 'undefined' && this.state.currency && 
              <Col sm={1}>{this.state.currency}</Col>
            }
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>
              Add some photos:
            </Col>
            <Col sm={2}>
              <FileUpload />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>
              Rules
            </Col>
            <Col sm={4}>
              <FormControl componentClass="textarea" placeholder="List any special rules (optional)" value={this.state.rules} onChange={this.HandleChangeRules} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>
              Notes 
            </Col>
            <Col sm={4}>
              <FormControl componentClass="textarea" placeholder="Notes (optional)" value={this.state.notes} onChange={this.HandleChangeNotes} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>
              Email
            </Col>
            <Col sm={4}>
              <FormControl type="email" placeholder="Email" value={this.state.email} onChange={this.HandleChangeEmail} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>
              Phone
            </Col>
            {typeof this.state.phonePrefix !== 'undefined' && this.state.phonePrefix &&
              <Col sm={2}>
                +{this.state.phonePrefix}
              </Col>
            }
            <Col sm={2}>
              <FormControl placeholder="Phone" value={this.state.phone} onChange={this.HandleChangePhone} />
            </Col>
          </FormGroup>
        </Form>
        <div>
          <Button onClick={this.HandleSubmit}>Submit</Button>
        </div>
      </div>
    )
  }
}

export default Submit
