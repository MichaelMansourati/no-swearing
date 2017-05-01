const flickrarr11 = require('./arr11') //change this every run
const fs = require('fs')
const request = require('request')
const dotenv = require('dotenv').config()
const visionkey = process.env.VISION_API_KEY

const mockReq = (url) => {
  return ({"requests":[
    {
      "image":{
        "source": {
          "imageUri": url.toString()
        }
      },
      "features":[
        {
          "type":"IMAGE_PROPERTIES"
        }
      ]
    }
  ]})
} //request JSON template

const visionPromise = () => {
  return new Promise((resolve) => {
    console.log(`begin Vision API call for palettes`)
    flickrarr11.forEach((obj) => {
      let paletteArr = []
      request({
        method: 'POST',
        url: 'https://vision.googleapis.com/v1/images:annotate?key=' + visionkey,
        json: mockReq (obj.url)
      }, (err, resp, body) => {
        console.log(body.responses[0].error) //
        const temp = body.responses[0].imagePropertiesAnnotation.dominantColors.colors.slice(0,4);
        temp.map((palette) => {
          const clr = palette.color
          const clrObj = {score: palette.score}
          clrObj.red = clr.red
          clrObj.green = clr.green
          clrObj.blue = clr.blue
          paletteArr.push(clrObj)
        })
        obj['palette'] = paletteArr
        console.log(obj)
      })
    })
    setTimeout(() => resolve("B"), 15000)
  })
} //palettizes URL images with an API call to Google Vision

const makeString = () => {
  return new Promise((resolve) => {
    console.log(`begin data object massaging`)
    toSave += `exports.seed = function(knex, Promise) { return knex('imagesdb').then(function () { return Promise.all([\n`
      flickrarr11.forEach((obj) => {
        const p = obj.geo
        const s = obj.palette
        toSave += `knex('imagesdb').insert({url: '${obj.url}', lat: ${p.latitude}, lon: ${p.longitude}, neighbourhood: '${p.neighbourhood._content}', locality: '${p.locality._content}', region: '${p.region._content}', country: '${p.country._content}', photog: '${obj.photog}', views: ${obj.views}, score1: ${s[0].score}, red1: ${s[0].red}, green1: ${s[0].green}, blue1: ${s[0].blue}, score2: ${s[1].score}, red2: ${s[1].red}, green2: ${s[1].green}, blue2: ${s[1].blue}, score3: ${s[2].score}, red3: ${s[2].red}, green3: ${s[2].green}, blue3: ${s[2].blue}, score4: ${s[3].score}, red4: ${s[3].red}, green4: ${s[3].green}, blue4: ${s[3].blue} }),\n`
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

/*
  flickrPromise()
  .then(() => {
  visionPromise()
})
.then(() => {
makeString()
})
.then(() => {
writeStream()
})
.catch(console.error)
*/

(async function() {
  let result1 = await visionPromise()
  let make = await makeString()
  let write = await writeStream()
})()
