import React, { Component } from 'react'
import { Image } from 'react-bootstrap'
import EmbedMap from './EmbedMap.js'
import ImageGallery from 'react-image-gallery'
import Config from './config.js'
import "react-image-gallery/styles/css/image-gallery.css";
import balls from './balls.png'

class TourneyPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showInfo: false
    }
    this.images = null
    this.HandleShowInfo = this.HandleShowInfo.bind(this)
    if (typeof this.props.tourney.images !== 'undefined') {
      this.images = this.props.tourney.images.map((image) =>  {
        //let imageName = Config.cdn.url + '/images/' + image.tmpName + '.' + image.ext
        let imageName = Config.cdn.url + '/images/' + image.th
        let thumbNail = Config.cdn.url + '/images/' + image.th
        return {original: imageName, thumbnail: thumbNail}
      })
    }
  }

  HandleShowInfo() {
    this.props.showInfo(this.props.tourney._id)
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
      <div className="atourney">
        <div className="tourneyImages">
          {this.images &&
            <ImageGallery items={this.images} lazyLoad={true} showThumbnails={false} showFullscreenButton={false} showPlayButton={false} showBullets={true} showNav={false} />
          }
          {!this.images &&
            <Image className="imageplaceholder" src={balls} />
          }
        </div>
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
      </div>
    )
  }
}

export default TourneyPanel
