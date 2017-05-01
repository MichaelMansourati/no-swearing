require('dotenv').config()

const PORT        = process.env.PORT || 8005
const ENV         = process.env.ENV || 'development'
const express     = require('express')
const bodyParser  = require('body-parser')
const app         = express()
const bcrypt      = require('bcrypt')
const knexConfig  = require('./knexfile')
const knex        = require('knex')(knexConfig[ENV])
const morgan      = require('morgan')
const knexLogger  = require('knex-logger')

const dashboardRoutes = require('./routes/dashboard')
const landingRoutes = require('./routes/landing')

app.use(morgan('dev'))
app.use(knexLogger(knex))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

// Mount all resource routes
app.use('/', dashboardRoutes(knex, bcrypt))
app.use('/', landingRoutes(knex))

app.get('/test', (req, res) => {
  res.sendFile(__dirname + '/test.html')
})

app.listen(PORT)
