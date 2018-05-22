import React, { Component } from 'react'
import EmbedMap from './EmbedMap.js'

class TourneyPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showInfo: false
    }
    this.HandleShowInfo = this.HandleShowInfo.bind(this)
  }

  HandleShowInfo() {
    this.setState({
      showInfo: !this.state.showInfo
    })
  }

  render() {
    let tourney = this.props.tourney
    let singdoub = 'Singles'
    if (!tourney.singdoub) {
      singdoub = 'Doubles'
    }
    let ampm = 'PM'
    if (ampm === 0) {
      ampm = 'AM'
    }
    if (tourney.minute < 10 && tourney.minute.toString().length < 2) {
      tourney.minute = '0' + tourney.minute
    }
    return(
      <div key={tourney._id} className="tourney_info" onClick={this.HandleShowInfo}>
        <div className="game_type_area">
          {tourney.gameType} - {singdoub}
        </div>
        <div className="venue_area">
          {tourney.venue}
        </div>
        <div>
          {tourney.frequency} - {tourney.day}
        </div>
        <div>
        {tourney.hour}:{tourney.minute}&nbsp;{ampm}
        </div>
        {this.state.showInfo &&
          <div>
						<EmbedMap />
          </div>
        }
      </div>
    )
  }
}

export default TourneyPanel
