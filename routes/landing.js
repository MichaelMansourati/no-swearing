const express = require('express')
const router  = express.Router()

module.exports = (knex) => {

  router.get('/', (req, res) => {
    knex
      .select('*')
      .from('imagesdb')
      .then((results) => {
        res.json(results)
    })
  }) //landing page for the site

  router.get('/palette/:hex', (req, res) => {
    knex
      .select('*')
      .from('imagesdb')
      .then((results) => {
        res.json(results)
    })
  }) //colour query

  router.get('/geo/:geo', (req, res) => {
    knex
      .select('*')
      .from('imagesdb')
      .then((results) => {
        res.json(results)
    })
  }) //location query

  router.post('/fave/:imageid', (req, res) => {
    knex
      .select('*')
      .from('likesdb')
      .then((results) => {
        res.json(results)
    })
  }) //user faving a picture

  return router
}
