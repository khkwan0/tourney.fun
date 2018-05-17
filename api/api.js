const fastify = require('fastify')()
const csc = require('countrycitystatejson')
const config = require('./config.js')
const monk = require('monk');

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

fastify.post('/submit', (req, res) => {
  console.log('submit')
  let submissions = db.get('submissions')
  req.body.timestamp = new Date()
  submissions.insert(req.body)
  .then((result) => {
    res.code(200).send(result)
  })
  .catch((err) => {
    console.log(err)
  })
})

fastify.get('/getsubmissions', (req, res) => {
  console.log('getsubmissions')
    let submissions = db.get('submissions')
    submissions.find()
    .then((result) => {
      res.code(200).send(result)
    })
  .catch((err) => {
    console.log(err)
  })
})

fastify.listen(6277, '0.0.0.0', (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log(`server listening on ${fastify.server.address().port}`)
  }
})
