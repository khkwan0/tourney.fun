import React, { Component } from 'react'
import { Modal, Button } from 'react-bootstrap'

class TourneyDetails extends Component {
  render() {
    return(
      <div>
        <Modal show={true} onHide={this.props.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.tourney.venue}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div>
            <h4>{this.props.tourney.address}</h4>
            <h4>{this.props.tourney.city}, {this.props.tourney.state}, {this.props.tourney.country}</h4>
          </div>a
          </Modal.Body>
          <Modal.Footer><Button onClick={this.props.closeModal}>Close</Button></Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default TourneyDetails
