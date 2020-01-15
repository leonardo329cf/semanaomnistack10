const { Router } = require('express')

const DevController = require('./controllers/DevController')

const routes = Router()

//index, show, store, update, destroy
routes.get('/devs', DevController.index)
routes.post('/devs', DevController.store)

module.exports = routes