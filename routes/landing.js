const express = require('express')
const router  = express.Router()
/*
TODO:
AFTER the real massive db seeding, look into how many urls i can actually get back so determine colour range and score minimum
console.log(req.body) >> to double check where the content is!
*/
module.exports = (knex) => {

  router.get('/', (req, res) => {
    //add implementation for logged-in users on which image is already faved!!
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
    const red1Range = []
    const green1Range = []
    const blue1Range = []
    //1 colour query:
    knex('imagesdb')
    .whereBetween('red1', red1Range)
    .andWhereBetween('green1', green1Range)
    .andWhereBetween('blue1', blue1Range)
    //.andWhere('score1', '>', 0.15)
    .select('*')
    .limit(60)
    .then((results) => {
      res.json(results)
    })
  }) //colour query

  router.get('/geo', (req, res) => {
    const neighbourhood = req.body.neighbourhood
    knex('imagesdb')
    .select('*')
    .where('neighbourhood', neighbourhood)
    .limit(60)
    .then((results) => {
      res.json(results)
    })
  }) //location query

  router.post('/fave/:imageid', (req, res) => {
    const userid = req.body.someshit
    const imageid = req.body.someshit
    knex('likesdb')
    .insert({usersid: userid, imagesid: imageid}) //TODO: double check that these req.body.SOMESHIT is correct
    .then(() => {
      res.sendStatus(200)
    })
  }) //user faving a picture

  return router
}
