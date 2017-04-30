const express = require('express')
const router  = express.Router()
/*
TODO:
AFTER the real massive db seeding, look into how many urls i can actually get back
console.log(req.body) >> to double check where the content is!
*/
module.exports = (knex) => {

  router.get('/', (req, res) => {
    knex('imagesdb')
    .whereBetween('red1', [0, 60])
    .andWhereBetween('green1', [0, 60])
    .andWhereBetween('blue1', [145, 255])
    //.andWhere('score1', '>', 0.15)
    .select('*')
    .limit(60)
    .then((results) => {
      res.json(results)
    })
  })//landing page for the site

  router.get('/palette', (req, res) => {
    //1 colour query:
    knex('imagesdb').where({
      red1: req.body.red1,
      green1:  req.body.green1,
      blue1: req.body.blue1
    }).select('*')
    .limit(60)
    .then((results) => {
      res.json(results)
    })
  }) //colour query

  router.get('/geo', (req, res) => {
    knex('imagesdb')
    .select('*')
    .where('neighbourhood', req.body.geo)
    .limit(60)
    .then((results) => {
      res.json(results)
    })
  }) //location query

  router.post('/fave/:imageid', (req, res) => {
    knex
    .then((results) => {
      res.sendStatus(200)
    })
  }) //user faving a picture

  return router
}
