const flickrarr11 = require('./arr11') //change this every run
const fs = require('fs')
const dotenv = require('dotenv').config()
const visionkey = process.env.VISION_API_KEY
var request = require('request')

console.log(`exports.seed = function(knex, Promise) { return knex('imagesdb').then(function () { return Promise.all([`)

  const mockReq = (url) => {
    return ({"requests":[
      {
        "image":{
          "source": {
            "imageUri": url
          }
        },
        "features":[
          {
            "type":"IMAGE_PROPERTIES"
          }
        ]
      }
    ]})
  }

  flickrarr11.forEach((obj) => {
    request({
      method: 'POST',
      url: 'https://vision.googleapis.com/v1/images:annotate?key=' + visionkey,
      json: mockReq (obj.url)
    }, (err, resp, body) => {
      let s = []
      const temp = body.responses[0].imagePropertiesAnnotation.dominantColors.colors.slice(0,4);
      temp.map((palette) => {
        const clr = palette.color
        const clrObj = {score: palette.score}
        clrObj.red = clr.red
        clrObj.green = clr.green
        clrObj.blue = clr.blue
        s.push(clrObj)
      })
      console.log(`knex('imagesdb').insert({url: '${obj.url}', lat: ${obj.geo.latitude}, lon: ${obj.geo.longitude}, neighbourhood: '${obj.geo.neighbourhood._content}', locality: '${obj.geo.locality._content}', region: '${obj.geo.region._content}', country: '${obj.geo.country._content}', photog: '${obj.photog}', views: ${obj.views}, score1: ${s[0].score}, red1: ${s[0].red}, green1: ${s[0].green}, blue1: ${s[0].blue}, score2: ${s[1].score}, red2: ${s[1].red}, green2: ${s[1].green}, blue2: ${s[1].blue}, score3: ${s[2].score}, red3: ${s[2].red}, green3: ${s[2].green}, blue3: ${s[2].blue}, score4: ${s[3].score}, red4: ${s[3].red}, green4: ${s[3].green}, blue4: ${s[3].blue} }),\n`)
    })
  })
