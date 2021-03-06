const dataArrFilePath = './flickrarr.js'
const flickrarr = require(dataArrFilePath)
const filePath = './seeds/15imagesdb.js' //the seed file path

const fs = require('fs')
const request = require('request')
const dotenv = require('dotenv').config()
const visionkey = process.env.VISION_API_KEY
let toSave = ''

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
    flickrarr.forEach((obj) => {
      let paletteArr = []
      request({
        method: 'POST',
        url: 'https://vision.googleapis.com/v1/images:annotate?key=' + visionkey,
        json: mockReq (obj.url)
      }, (err, resp, body) => {
        //console.log(body)
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
    setTimeout(() => resolve("B"), 25000)
  })
} //palettizes URL images with an API call to Google Vision

const makeString = () => {
  return new Promise((resolve) => {
    console.log(`begin data object massaging`)
    toSave += `exports.seed = function(knex, Promise) { return knex('imagesdb').then(function () { return Promise.all([\n`
      flickrarr.forEach((obj) => {
        const p = obj.geo
        const s = obj.palette
        if (s.length == 4) {
          toSave += `knex('imagesdb').insert({url: '${obj.url}', lat: ${p.latitude}, lon: ${p.longitude}, neighbourhood: "${p.neighbourhood._content}", locality: '${p.locality._content}', region: '${p.region._content}', country: '${p.country._content}', photog: "${obj.photog}", views: ${obj.views}, score1: ${s[0].score}, red1: ${s[0].red}, green1: ${s[0].green}, blue1: ${s[0].blue}, score2: ${s[1].score}, red2: ${s[1].red}, green2: ${s[1].green}, blue2: ${s[1].blue}, score3: ${s[2].score}, red3: ${s[2].red}, green3: ${s[2].green}, blue3: ${s[2].blue}, score4: ${s[3].score}, red4: ${s[3].red}, green4: ${s[3].green}, blue4: ${s[3].blue} }),\n`
        }
      })
      toSave += ']);\n});\n};'
      setTimeout(() => resolve("C"), 1000)
    })
  } //massages the object data into knex calls

  const writeStream = () => {
    return new Promise((resolve) => {
      console.log(`begin write stream`)
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
  await visionPromise()
  await makeString()
  await writeStream()
})()
