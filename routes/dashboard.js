const express = require('express')
const router  = express.Router()

module.exports = (knex) => {

  router.get('/dashboard', (req, res) => {
    knex('likesdb')
    .select('imagesid')
    .where('usersid', 1) //req.body.usersid !!
    .then((results) => {
      const urlArr = []
      results.forEach((result) => {
        urlArr.push(result.imagesid)
      })
      knex('imagesdb')
      .select('*')
      .whereIn('id', urlArr)
      .then((results) => {
        res.json(results)
      })
    })
  }) //users dashboard

  router.post('/login', (req, res) => {
    //log in validation! (with bcrypt)

  }) //user login

  router.post('/signup', (req, res) => {
    //sign up validation (also bcrypt for valid not-duplicated emails)

  }) //users sign up

  return router
}
