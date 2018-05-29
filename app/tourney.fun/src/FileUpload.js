import React, { Component } from 'react'
import Config from './config.js'
import Dropzone from 'react-dropzone'

class FileUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: []
    }
    this.onDrop = this.onDrop.bind(this)
  }

  onDrop(files) {
    console.log(files)
    let formData = new FormData()
    files.forEach((file) => {
      formData.append(file.name,file)
    })
    fetch(Config.api.url + '/images/venue/',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
        body: formData
      }
    )
    .then((result) => { return result.json() })
    .then((resultJson) => {
      console.log(resultJson)
      this.props.handleAddImages(resultJson)
    })
    .catch((err) => {
    })
  }

  render() {
    return(
      <div>
        <Dropzone onDrop={this.onDrop}>
          <div>Try dropping some files here, or click to select files to upload</div>
        </Dropzone>
        <div>
          {this.state.images.length > 0 &&
            <span>{this.state.images.length} saved</span>
          }      
        </div>
      </div>
    )
  }
}

export default FileUpload
