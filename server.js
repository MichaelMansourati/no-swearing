'use strict'

require('dotenv').config()

const PORT        = process.env.PORT || 8080
const ENV         = process.env.ENV || 'development'
const express     = require('express')
const bodyParser  = require('body-parser')
const app         = express()

const knexConfig  = require('./knexfile')
const knex        = require('knex')(knexConfig[ENV])
const morgan      = require('morgan')
const knexLogger  = require('knex-logger')

// Seperated Routes for each Resource
const usersRoutes = require('./routes/users')

app.use(morgan('dev'))

app.use(knexLogger(knex))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

// Mount all resource routes
app.use('/api/users', usersRoutes(knex))

// Landing page
app.get('/', (req, res) => {
  res.render('index')
})

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT)
})
