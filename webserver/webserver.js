import { log } from '../util/util.js'
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import db from '../db/db.js'

dotenv.config({ path: '/../.env' })
const WEBSERVER_ENABLED = process.env.WEBSERVER_ENABLED == 1

let webserverReady = false

const run = () => {
  if (WEBSERVER_ENABLED) {
    const webApp = express()
    const PORT = 3000
    webApp.set('view engine', 'ejs')

    webApp.listen(PORT, () => {
      log(
        '\x1b[32m' +
          ' ✓' +
          '\x1b[0m' +
          ' Webserver listening on port ' +
          '\x1b[7m' +
          PORT +
          '\x1b[0m',
        true
      )
      webserverReady = true
    })
    webApp.use(router)
    log('  Webserver app initializing...', true)
  }
}

const isReady = () => {
  return webserverReady
}

// Whoever has to fix this later, myself included, I am sorry
// the above code should be easy to understand and work, no promises on the below code.
// I had used the router for something i tried to be fancy doing but it was wrong.

let router = express.Router()

router.use(express.static('public'))
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.use((req, res, next) => {
  log('Request type:' + req.method, true)
  next()
})

// read request
router.get('/', function (request, response) {
  db.getMonsterArray()
    .then((results) => {
      response.render('index.ejs', { monsters: results })
      log(results.length + ' monsters!', true)
    })
    .catch(function (err) {
      log('ERROR: unable to get monsters from DB', true)
      log(err, true)
    })
})

// append request
router.post('/monsters', (request, response) => {
  log('monster recieved', true)
  log(request.body, true)
  db.addEntry(request.body, 'monsters').then((successMessage) => {
    log(successMessage, true)
    response.redirect('/')
  })
})

// router.post('/validator', () => {
//   log('validation update request recieved', true)

//   let newDbName = 'characters'

//   db.newColl(newDbName).then(result =>{
//   console.log(result);
// });
//   dbModify()
// })

// update request
router.put('/monsters', (request, response) => {
  db.editMonster(
    {},
    {
      $set: {
        name: request.body.name,
        special: request.body.special,
      },
    },
    {
      sort: { _id: 1 },
      upsert: true,
    }
  ).then(
    (result) => {
      response.send(result)
      // response.redirect('/');
    },
    (err) => {
      response.send(err)
      log('ERROR Updating Monster', true)
      log(err, true)
    }
  )
})

// delete request
router.delete('/monsters', (request, response) => {
  db.deleteMonster(
    //query
    {
      name: request.body.name,
    },
    //options
    {}
  ).then(
    () => {
      response.redirect('/')
    },
    (err) => {
      response.send(err)
      log('ERROR Deleting Monster', true)
      log(err, true)
    }
  )
})

export default {
  run,
  isReady,
}
