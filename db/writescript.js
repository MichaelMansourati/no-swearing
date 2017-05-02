const flickrarr11 = require('./arr11') //change this every run
const fs = require('fs')
let toSave = ''

const makeString = () => {
  return new Promise((resolve) => {
    console.log(`begin data object massaging`)
    toSave += `exports.seed = function(knex, Promise) { return knex('imagesdb').then(function () { return Promise.all([\n`
      flickrarr11.forEach((obj) => {
        const p = obj.geo
        const s = obj.palette
        toSave += `knex('imagesdb').insert({url: '${obj.url}', lat: ${p.latitude}, lon: ${p.longitude}, neighbourhood: '${p.neighbourhood._content}', locality: '${p.locality._content}', region: '${p.region._content}', country: '${p.country._content}', photog: '${obj.photog}', views: ${obj.views}, score1: , red1: , green1: , blue1: , score2: , red2: , green2: , blue2: , score3: , red3: , green3: , blue3: , score4: , red4: , green4: , blue4:  }),\n`
      })
      toSave += ']);\n});\n};'
      setTimeout(() => resolve("C"), 1000)
    })
  } //massages the object data into knex calls

  const writeStream = () => {
    return new Promise((resolve) => {
      console.log(`begin write stream`)
      const filePath = './seeds/11imagesdb.js'
      fs.writeFile(filePath, toSave, function(err) {
        if(err) {
          return console.log(err)
        }
        console.log("seed file successfully created")
        resolve("D")
      })
    })
  } //file stream to write into the seed file

(async function() {
  let make = await makeString()
  let write = await writeStream()
})()
