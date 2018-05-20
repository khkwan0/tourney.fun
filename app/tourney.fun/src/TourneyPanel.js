import React, { Component } from 'react'

class TourneyPanel extends Component {

  constructor(props) {
    super(props)
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
      <div key={tourney._id} className="tourney_info">
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
      </div>
    )
  }
}

export default TourneyPanel
