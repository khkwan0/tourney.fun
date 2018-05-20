import React, { Component } from 'react'
import { Button, Table } from 'react-bootstrap'
import Config from './config.js'
import './Admin.css'

class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submissions: []
    }
    this.HandleAccept = this.HandleAccept.bind(this)
    this.HandleRemove = this.HandleRemove.bind(this)
  }

  componentDidMount() {
    fetch(Config.api.url+'/submissions',
      {
        credentials: 'incluse',
        headers: {
          Accept: 'application/json'
        }
      }
    )
    .then((result) => { return result.json() })
    .then((resultJson) => {
      this.setState({
        submissions: resultJson
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  HandleAccept(idx) {
    let id = this.state.submissions[idx]._id
    console.log(id)
    fetch(Config.api.url+'/submissions/'+id,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type':'application/json',
           Accept: 'application/json'
        },
        body: JSON.stringify({'approve': 1 })
      }
    )
    .then((result) => { return result.json() })
    .then((resultJson) => {
      if (resultJson.ok === 1) {
        let subs = this.state.submissions
        subs.splice(idx, 1)
        this.setState({
          submissions: subs
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }

  HandleRemove(idx) {
    console.log(idx)
    let id = this.state.submissions[idx]._id
    fetch(Config.api.url+'/submissions/'+id,
      {
        method: 'delete',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({del: id})
      }
    )
    .then((result) => { return result.json() })
    .then((resultJson) => {
      console.log(resultJson)
      if (resultJson.ok === 1) {
        let subs = this.state.submissions
        subs.splice(idx, 1)
        this.setState({
          submissions: subs
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }

  render() {
    return(
      <div>
        <h1>Submissions</h1>
        <Table>
          <thead>
            <tr>
              <th>Where</th>
              <th>When</th>
              <th>what</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.submissions.map((submission, idx) => {
              let ampm = 'PM'
              if (submission.ampm !== 1) {
                ampm = 'AM'
              }
              let playersPerTeam = 'Singles'
              if (submission.singles === false) {
                playersPerTeam = 'Doubles'
              }
              return (
                <tr key={idx}>
                  <td>{submission.venue}<br />{submission.address}<br />{submission.city},{submission.state}, {submission.country}<br />{submission.phone}<br />{submission.email}</td>
                  <td>{submission.day}<br />{submission.frequency}<br />{submission.hour}:{submission.minute}&nbsp;{ampm}</td>
                  <td>{submission.gameType}<br />{submission.format}<br />{playersPerTeam}<br />{submission.entryFee}&nbsp;{submission.currency}</td>
                  <td><Button bsStyle="primary" bsSize="xsmall" onClick={() => this.HandleAccept(idx)}>Accept</Button>&nbsp;<Button bsStyle="warning" bsSize="xsmall" onClick={() => this.HandleRemove(idx)}>Remove</Button></td></tr>)
              })
            }
          </tbody>
        </Table>
      </div>
    )
  }
}

export default Admin
