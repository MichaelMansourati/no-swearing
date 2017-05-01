const express = require('express')
const router  = express.Router()
/*
TODO:
AFTER the real massive db seeding, look into how many urls i can actually get back so determine colour range and score minimum
console.log(req.body) >> to double check where the content is!
*/
module.exports = (knex) => {

  router.get('/', (req, res) => {
    //TODO: add implementation for logged-in users on which image is already faved!!
    //which means i also need the logged in user's user id with this get request
    const userid = 1
    knex('imagesdb')
    .whereBetween('red1', [0, 60]) // WHEN DB IS FULLY SEEDED
    .andWhereBetween('green1', [0, 60]) //DONT FORGET TO CHANGE THESE RGB VALUES
    .andWhereBetween('blue1', [145, 255]) //needs a set colour range!
    //.andWhere('score1', '>', 0.15)
    .select('*')
    .limit(60)
    .then((results) => {
      results.forEach((url) => {
        knex('likesdb')
        .select('*')
        .where('imagesid', url.id)
        .andWhere('usersid', userid)
        .then((results) => {
          if (results == true) {
            url['liked'] = true
          }
        })
      }) //HOW TO PROMISIFY THIS SO THE RES.JSON RESULTS WILL SEND PROPERLY
      //res.json(results)
    })
    .catch((err) => { console.error(err) })
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
    .catch((err) => { console.error(err) })
    //TODO: multi-colour query

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
    .catch((err) => { console.error(err) })
  }) //location query

  router.post('/fave/:imageid', (req, res) => {
    const userid = req.body.someshit
    const imageid = req.body.someshit
    knex('likesdb')
    .insert({usersid: userid, imagesid: imageid}) //TODO: double check that these req.body.SOMESHIT is correct
    .then(() => {
      res.sendStatus(200)
    })
    .catch((err) => { console.error(err) })
  }) //user faving a picture

  return router
}
