const fs = require('fs')
const request = require('request')
const dotenv = require('dotenv').config()
const flickrkey = process.env.FLICKR_API_KEY
const flickrsecret = process.env.FLICKR_API_SECRET
const visionkey = process.env.VISION_API_KEY
const Flickr = require("flickrapi"),
flickrOptions = {
  api_key: flickrkey,
  secret: flickrsecret,
  requestOptions: {
    timeout: 20000,
  }
}
const flickrgroupIDs = ['17242708@N00', '51829765@N00', '81344316@N00', '541622@N23']
//all 4 relevant flickr photo groups
let data = {}
let toSave = ''

const flickrPromise = () => {
  return new Promise((resolve) => {
    console.log(`begin Flickr API call for URLs`)
    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
      flickrgroupIDs.forEach((group) => {
        flickr.groups.pools.getPhotos({
          group_id: group,
          per_page: 10,
          page: 1
        }, function(err, result) {
          if (err) {throw new Error(err)}
          //console.log(result.photos.photo)
          result.photos.photo.forEach((bloop) => {
            flickr.photos.getInfo({
              photo_id: bloop.id
            }, function(err, result) {
              if (err) {throw new Error(err)}
              const bleep = result.photo
              if (bleep.location != undefined) {
                data[bleep.id] = {}
                data[bleep.id]['url'] = `https://farm${bleep.farm}.staticflickr.com/${bleep.server}/${bleep.id}_${bleep.secret}.jpg`
                data[bleep.id]['geo'] = bleep.location
                data[bleep.id]['views'] = Number(bleep.views)
              }
            })
          })
        })
      })
      resolve()
    })
  })
} //makes 2 API calls to Flickr - then adds a new object to data for each photo with geo-locations

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
    for (let j in data) {
      let paletteArr = []
      request({
        method: 'POST',
        url: 'https://vision.googleapis.com/v1/images:annotate?key=' + visionkey,
        json: mockReq (data[j].url)
      }, (err, resp, body) => {
        const temp = body.responses[0].imagePropertiesAnnotation.dominantColors.colors.slice(0,4);
        temp.map((palette) => {
          const clr = palette.color
          const clrObj = {score: palette.score}
          clrObj.red = clr.red
          clrObj.green = clr.green
          clrObj.blue = clr.blue
          paletteArr.push(clrObj)
        })
        data[j]['palette'] = paletteArr
        console.log(data[j])
      })
    }
    console.log('vision complete')
    resolve()
  })
} //palettizes URL images with an API call to Google Vision

const makeString = () => {
  return new Promise((resolve) => {
    console.log(`begin data object massaging`)
    toSave += `exports.seed = function(knex, Promise) { return knex('imagesdb').then(function () { return Promise.all([\n`
    for (let i in data) {
      //console.log(data[i])
      const p = data[i].geo
      const s = data[i].palette
      toSave += `knex('imagesdb').insert({url: '${data[i].url}', geo: {lat: ${p.latitude}, lon: ${p.longitude}, neighbourhood: '${p.neighbourhood._content}', county: '${p.county._content}', region: '${p.region._content}', country: '${p.country._content}'}, views: ${data[i].views}, palette: [${s}] ),\n`
    }
    toSave += ']);\n});\n};'
    resolve()
  })
}

const writeStream = () => {
  return new Promise((resolve) => {
    console.log(`begin write stream`)
    fs.writeFile("./seeds/10imagesdb.js", toSave, function(err) {
      if(err) {
        return console.log(err)
      }
      console.log("seed file successfully created - remember to delete the comma from the last knex call")
    })
    resolve()
  })
}

(async function() {
  let result = await flickrPromise()
  let result1 = await visionPromise()
  let make = await makeString()
  let write = await writeStream()
})()
