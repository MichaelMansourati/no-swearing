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
    .whereBetween('red1', [0, 60]) // WHEN DB IS FULLY SEEDED
    .andWhereBetween('green1', [0, 60]) //DONT FORGET TO CHANGE THESE RGB VALUES
    .andWhereBetween('blue1', [145, 255]) //needs a set colour range!
    //.andWhere('score1', '>', 0.15)
    .select('*')
    .limit(60)
    .then((results) => {
      res.json(results)
    })
  })//landing page for the site

  router.get('/palette', (req, res) => {
    //1 colour query:
    knex('imagesdb')
    .whereBetween('red1', [req.body.someshit, req.body.someshit])
    .andWhereBetween('green1', [req.body.someshit, req.body.someshit])
    .andWhereBetween('blue1', [req.body.someshit, req.body.someshit])
    //.andWhere('score1', '>', 0.15)
    .select('*')
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
    knex('likesdb')
    .insert({usersid: req.body.usersid, imagesid: req.body.imagesid}) //TODO: double check that these req.body.SOMESHIT is correct
    .then(() => {
      res.sendStatus(200)
    })
  }) //user faving a picture

  return router
}