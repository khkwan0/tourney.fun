const fastify = require('fastify')()
const csc = require('countrycitystatejson')
const config = require('./config.js')
const monk = require('monk')
const moment = require('moment-timezone')
const geotz = require('geo-tz')

const db = new monk(config.mongo.url+'/tourneyfun')

fastify.use(require('cors')({origin: true, credentials: true}))

fastify.get('/getstates/:country', (req, res) => {
  let states = csc.getStatesByShort(req.params.country)
  res.code(200).send({states: states})
})

fastify.get('/getcities/:country/:state', (req, res) => {
  let cities = csc.getCities(req.params.country, req.params.state)
  res.code(200).send({cities: cities})
})

fastify.get('/tournaments/all/:lat/:lng', (req, res) => {

})

const getNearestCity = (lat, lng) => {
  return new Promise((resolve, reject) => {
    let cities = db.get('cities')
    let city = null
    cities.findOne({
      location: {
        $geoNear: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          }
        }
      }
    })
    .then((result) => {
      resolve(result)
    })
    .catch((err) => {
      reject(err)
    })
  })
}

const getNearestTourneys = (lat, lng, maxDistance) => {
  return new Promise((resolve, reject) => {
    let tournaments = db.get('tournaments')
    tournaments.find(
    {
      location: {
        $geoNear: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $minDistance: 0,
          $maxDistance: maxDistance
        }
      }
    })
    .then((result) => {
      resolve(result)
    })
    .catch((err) => {
      reject(err)
    })
  })
}

fastify.get('/tournaments/:lat/:lng', (req, res) => {
  var city = null
  let lat = parseFloat(req.params.lat)
  let lng = parseFloat(req.params.lng)
  getNearestCity(lat, lng)
  .then((result) => {
    city = result
    return getNearestTourneys(lat, lng, 10000)
  })
  .then((result) => {
    let tz = geotz(lat, lng)
    console.log(tz)
    let localHour = moment().tz(tz).hour()
    let currentDayOfWeek = moment().tz(tz).isoWeekday()
    console.log('currentdayofweek' + currentDayOfWeek)
    let toSlice = []
    let today = []
    let tomorrow = []
    let other = []
    result.forEach((tourney, idx) => {
      let tourneyDay = moment().day(tourney.day).isoWeekday()
      tourney.tourneyDay = tourneyDay
      if (currentDayOfWeek === tourneyDay) {
        today.push(tourney)
      }
      if ((currentDayOfWeek === 7 && tourneyDay === 1) || (tourneyDay - currentDayOfWeek === 1)) {
        tomorrow.push(tourney)
      } else {
        other.push(tourney)
      }
    })
    let tourneys = {
      today: today,
      tomorrow: tomorrow,
      other:other
    }
    let response = {
      tourneys: tourneys,
      city: city,
      tz: tz,
      currentDayOfWeek: currentDayOfWeek,
      localDate: moment().tz(tz).format('ddd MMM Do YYYY, hh:mma')
    }
    res.code(200).send(response)
  })
  .catch((err) => {
    console.log(err)
    res.code(500).send(err)
  })
})

fastify.post('/submissions', (req, res) => {
  console.log('submit')
  let submissions = db.get('submissions')
  req.body.timestamp = new Date()
  req.body.approved = 0
  req.body.location = {
    type: 'Point',
    coordinates: [req.body.lng, req.body.lat]
  }
  submissions.insert(req.body)
  .then((result) => {
    res.code(200).send(result)
  })
  .catch((err) => {
    console.log(err)
  })
})

fastify.get('/submissions', (req, res) => {
  console.log(req.raw.method+' '+req.raw.url)
    let submissions = db.get('submissions')
    submissions.find({approved: 0})
    .then((result) => {
      res.code(200).send(result)
    })
  .catch((err) => {
    console.log(err)
  })
})

fastify.patch('/submissions/:id', (req, res) => {
  let id = req.params.id
  let approve = req.body.approve
  if (approve === 1) {
    let submissions = db.get('submissions')
    submissions.findOne({_id: id})
    .then((record) => {
      if (typeof record._id !== 'undefined' && record._id) {
        delete record._id
        let tournaments = db.get('tournaments')
        return tournaments.insert(record)
      } else {
        throw('no record found')
      }
    })
    .then((result) => {
      if (typeof result._id !== 'undefined' && result._id) {
        return submissions.update({_id: id}, {$set: {approved: 1}})
      } else {
        throw({err: 1, msg: 'failed to insert'})
      }
    })
    .then((result) => {
      res.code(200).send(result)
    })
    .catch((err) => {
      res.code(500).send(err)
    })
  } else {
    res.code(404).send()
  }
})

fastify.delete('/submissions/:id', (req, res) => {
  console.log(req.raw.originalUrl)
  let id = req.params.id
  if (id) {
    let submissions = db.get('submissions')
    submissions.update({_id: id}, {$set: {approved: -1}})
    .then((result) => {
      res.code(200).send(result)
    })
    .catch((err) => {
      console.log(err)
      res.code(500).send(err)
    })
  } else {
    res.code(404).send()
  }
})

fastify.listen(6277, '0.0.0.0', (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log(`server listening on ${fastify.server.address().port}`)
  }
})
