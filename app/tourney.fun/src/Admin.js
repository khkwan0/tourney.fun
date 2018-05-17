import React, { Component } from 'react'
import { Button, Table } from 'react-bootstrap'
import Config from './config.js'
import Submit from './Submit'

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
    fetch(Config.api.url+'/getsubmissions',
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

  HandleAccept(id) {
    console.log(id)
  }

  HandleRemove(idx) {
    console.log(idx)
  }

  render() {
    return(
      <div>
        <h1>Submissions</h1>
        <Table>
          <thead>
            <tr>
              <th>Venue</th>
              <th>Where</th>
              <th>When</th>
              <th>what</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.submissions.map((submission, idx) => {
              return (
                <tr key={idx}>
                  <td>{submission.venue}</td>
                  <td>{submission.address}<br />{submission.city},{submission.state}, {submission.country}<br />{submission.phone}<br />{submission.email}</td>
                  <td>{Submit.Frequency[submission.frequency]}</td>
                  <td>What</td>
                  <td><Button bsStyle="primary" bsSize="xsmall" onClick={() => this.HandleAccept(submission._id)}>Accept</Button>&nbsp;<Button bsStyle="warning" bsSize="xsmall" onClick={() => this.HandleRemove(idx)}>Remove</Button></td></tr>)
              })
            }
          </tbody>
        </Table>
      </div>
    )
  }
}

export default Admin
