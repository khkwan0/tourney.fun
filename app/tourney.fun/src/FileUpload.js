import React, { Component } from 'react'
import Config from './config.js'
import Dropzone from 'react-dropzone'

class FileUpload extends Component {
  constructor(props) {
    super(props)
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
    })
    .catch((err) => {
    })
  }

  render() {
    return(
      <Dropzone onDrop={this.onDrop}>
        <div>Try dropping some files here, or click to select files to upload</div>
      </Dropzone>
    )
  }
}

export default FileUpload
