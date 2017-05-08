const express = require('express')
const router  = new express.Router()
/*
TODO:
- AFTER the real massive db seeding, look into how many urls i can actually get back so determine colour range and score minimum
- double check where the content is from the front end - req.body VS req.params?
- how to promisify a knex call wrapped within a for loop O.o
*/
module.exports = (knex) => {



  router.get('/', (req, res) => {
    // Randomly choose index of array of colours to be searched
    const i = Math.floor(Math.random()*rgbArr.length)
    console.log(Math.random(rgbArr.length))
    const userid = 1
    console.log(typeof(rgbArr[i]), rgbArr[i])
    primaryColorSearch(rgbArr[i], res)
    .select('*')
    .limit(60)
    .then((results) => {

      res.json({body:results})
    })
    .catch((err) => { console.error(err) })
  })

  router.get('/palette', (req, res) => {
    const query = JSON.parse(req.query.colQuery)
    let secQuery = req.query.color2
    console.log( `Your request: ${query}\nYour Second request: ${secQuery}`)

    if(secQuery != undefined){
      secQuery = JSON.parse(secQuery)
      console.log(secQuery)
      /*
        Implement secondary colour search as function because is being used a second time
      */
      secondColorSearch(query, secQuery, res)
        .select('*')
        .limit(60)
        .then((results) => {
          res.json({body:results})
        })
        .catch((err) => { console.error(err) })
    }else{
      /* Returns a promise to be sent so functions are dynamic */
      primaryColorSearch(query, res)
        .select('*')
        .limit(60)
        .then((results) => {
          res.json({body:results})
        })
        .catch((err) => { console.error(err) })
    }
  })

  router.get('/geo/:neighbourhood', (req, res) => {
    let c1 = req.query.color
    let c2 = req.query.color2
    console.log( `Color search: ${c1} second search: ${c2}`)

    // console.log(JSON.parse(req.params.neighbourhood))
    const neighbourhood = req.params.neighbourhood
    if(c2 != undefined){
      c1 =JSON.parse(c1)
      c2 =JSON.parse(c2)
      secondColorSearch(c1, c2, res)
        .select('*')
        .where('neighbourhood', neighbourhood)
        .limit(60)
        .then((results) => {
          res.json({body:results})
        })
        .catch((err) => { console.error(err) })
    }
    else if(c1 != undefined){
      c1 =JSON.parse(c1)
      primaryColorSearch(c1, res)
        .select('*')
        .where('neighbourhood', neighbourhood)
        .limit(60)
        .then((results) => {
          res.json({body:results})
        })
        .catch((err) => { console.error(err) })
    }
    else{
      knex('imagesdb')
      .select('*')
      .where('neighbourhood', neighbourhood)
      .limit(60)
      .then((results) => {
        res.json({body:results})
      })
      .catch((err) => { console.error(err) })
    }
  }) //location query

  router.post('/fave/:imageid', (req, res) => {
    console.log(req.params.imageid, req.query.UID)
    const userid = Number(req.query.UID)
    const imageid = Number(req.params.imageid)
    knex('likesdb')
    .insert({usersid: userid, imagesid: imageid})
    .then(() => {
      res.sendStatus(200)
    })
    .catch((err) => { console.error(err) })
  }) //user faving a picture

  const rgbArr = [
    [[195, 255],[0, 60],[0, 60]],
    [[195, 255],[98, 158],[0, 60]],
    [[195, 255],[195,255],[0, 60]],
    [[0, 60],[98, 158],[0, 60]],
    [[0, 60],[0, 60],[195,255]],
    [[98, 158],[0, 60],[98, 158]],
    [[106, 166],[54, 114],[4, 64]],
    [[0, 60],[0, 60],[0, 60]],
    [[98, 158],[98, 158],[98, 158]],
    [[195,255],[195,255],[195,255]],
    [[195, 255],[0, 60],[0, 60]]
    ]

  const primaryColorSearch = (query, response) => {
    const red1Range = query[0]
    const green1Range = query[1]
    const blue1Range = query[2]

    return (
      knex('imagesdb')
        .whereBetween('red1', red1Range)
        .andWhereBetween('green1', green1Range)
        .andWhereBetween('blue1', blue1Range)

    )
  }

  const secondColorSearch = (query, secQuery, response) => {
    const red1Range = query[0]
    const green1Range = query[1]
    const blue1Range = query[2]

    const red2Range = secQuery[0]
    const green2Range = secQuery[1]
    const blue2Range = secQuery[2]

    return (
      knex('imagesdb')
        .where(function() {
          this.whereBetween('red1', red1Range)
          .andWhere(function(){
            this.whereBetween('green1', green1Range)
            .andWhereBetween('blue2', blue1Range)
          })
          .orWhereBetween('red2', red1Range)
          .andWhere(function() {
            this.whereBetween('blue2', blue1Range)
            .andWhereBetween('green2', green1Range)
          })
        })
        .andWhere(function(){
          this.where(function() {
            this.whereBetween('red1', red2Range)
            .andWhere(function(){
              this.whereBetween('green1', green2Range)
              .andWhereBetween('blue1', blue2Range)
            })
            .orWhereBetween('red2', red2Range)
            .andWhere(function() {
              this.whereBetween('green2', green2Range)
              .andWhereBetween('blue2', blue2Range)
            })
          })
        })

    )
  }


  return router
}
