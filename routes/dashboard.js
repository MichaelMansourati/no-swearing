const express = require('express')
const router  = express.Router()

module.exports = (knex) => {

  router.get('/dashboard', (req, res) => {
    knex
      .select('*')
      .from('likesdb')
      .then((results) => {
        res.json(results)
    })
  }) //users dashboard

  router.post('/login', (req, res) => {
    //log in validation! (with bcrypt)
    knex
      .select('*')
      .from('usersdb')
      .then((results) => {
        res.json(results)
    })
  }) //user login

  router.post('/signup', (req, res) => {
    //sign up validation (also bcrypt for valid not-duplicated emails)
    knex
      .select('*')
      .from('usersdb')
      .then((results) => {
        res.json(results)
    })
  }) //users sign up

  return router
}
