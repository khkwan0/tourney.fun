import React, { Component } from 'react'
import {withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps'
import Config from './config.js'

class Map extends Component {

  render() {
    let GoogleMapA = withScriptjs(withGoogleMap((props) => 
      <GoogleMap defaultCenter={{ lat: this.props.lat, lng: this.props.lng }} defaultZoom={15} zoom={15}>
        {props.isMarkerShown && <Marker position={{ lat: this.props.lat, lng: this.props.lng}} />}
      </GoogleMap>
    ))
    let gmapurl = "https://maps.googleapis.com/maps/api/js?key="+Config.Google.APIKEY+"&v=3.exp&libraries=geometry,drawing,places"

    return (
      <div>
        <GoogleMapA
          isMarkerShown
          googleMapURL={gmapurl}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `500px`, width: '500px'}} />}
          mapElement={<div style={{ height: `100%` }} /> }
        />
      </div>
    )
  }
}

export default Map
