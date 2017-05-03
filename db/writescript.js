const dataArrFilePath = './visionarr.js'
const visionarr = require(dataArrFilePath)

const fs = require('fs')
let toSave = ''

const makeString = () => {
  return new Promise((resolve) => {
    console.log(`begin data object massaging`)
    //toSave += `exports.seed = function(knex, Promise) { return knex('imagesdb').then(function () { return Promise.all([\n`
      visionarr.forEach((obj) => {
        console.log(obj)
        const p = obj.geo
        const s = obj.palette
        toSave += `knex('imagesdb').insert({url: '${obj.url}', lat: ${p.latitude}, lon: ${p.longitude}, neighbourhood: "${p.neighbourhood._content}", locality: '${p.locality._content}', region: '${p.region._content}', country: '${p.country._content}', photog: "${obj.photog}", views: ${obj.views}, score1: ${s[0].score}, red1: ${s[0].red}, green1: ${s[0].green}, blue1: ${s[0].blue}, score2: ${s[1].score}, red2: ${s[1].red}, green2: ${s[1].green}, blue2: ${s[1].blue}, score3: ${s[2].score}, red3: ${s[2].red}, green3: ${s[2].green}, blue3: ${s[2].blue}, score4: ${s[3].score}, red4: ${s[3].red}, green4: ${s[3].green}, blue4: ${s[3].blue} }),\n`
      })
      toSave += ']);\n});\n};'
      setTimeout(() => resolve("C"), 2000)
    })
  } //massages the object data into knex calls

  const writeStream = () => {
    return new Promise((resolve) => {
      console.log(`begin write stream`)
      const filePath = './seeds/15imagesdb.js'
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
  await makeString()
  await writeStream()
})()
