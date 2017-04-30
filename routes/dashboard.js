const express = require('express')
const router  = express.Router()

module.exports = (knex, bcrypt) => {

  router.get('/dashboard', (req, res) => {
    knex('likesdb')
    .select('imagesid')
    .where('usersid', 1) //req.body.usersid !!
    .then((results) => {
      const idArr = []
      results.forEach((result) => {
        idArr.push(result.imagesid)
      })
      knex('imagesdb')
      .select('*')
      .whereIn('id', idArr)
      .then((results) => {
        res.json(results)
      })
    })
  }) //users dashboard

  router.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    knex.select('id', 'name', 'password')
    .from('usersdb')
    .where('email', email)
    .then((resultsArr) => {
      try {
        if ( bcrypt.compareSync(password, resultsArr[0]['password']) ) {
          res.sendStatus(200)
        } else {
          res.status(403).send('Log in failed')
        }
      } catch (e) {
        res.status(403).send('Log in failed!');
      }
    })
    .catch(console.error)
  }) //checks against usersdb for user login

  router.post('/signup', (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = bcrypt.hashSync(req.body.password, 10)
    knex
    .select('*')
    .from('usersdb')
    .where('email', email)
    .then((results) => {
      if (results.length > 0) {
        res.status(403).send('Account already exists')
      } else {
        knex('usersdb')
        .insert({name: name, email: email, password: password})
        .returning('id')
        .then( (id) => {
          res.status(200).send(id)
        })
      }
    })
    .catch(console.error)
  }) //inserting valid new users into usersdb

  return router
}
