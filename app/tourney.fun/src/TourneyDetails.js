import React, { Component } from 'react'
import { Modal, Button } from 'react-bootstrap'

class TourneyDetails extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>{this.props.tourney.venue}</Modal.Title>
          </Modal.Header>
          <div>
            <h4>{this.props.tourney.address}</h4>
            <h4>{this.props.tourney.city}, {this.props.tourney.state}, {this.props.tourney.country}</h4>
          </div>
          <Modal.Footer><Button onClick={this.props.closeModal}>Close</Button></Modal.Footer>
        </Modal.Dialog>
      </div>
    )
  }
}

export default TourneyDetails
