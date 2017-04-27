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

const flickrgroupIDs = ['17242708@N00', '51829765@N00', '81344316@N00', '541622@N23'] //all 4 relevant flickr photo groups
let data = {} //each photo is its own object within this master object
let toSave = '' //the master string for the massaged data

const flickrPromise = () => {
  return new Promise((resolve) => {
    console.log(`begin Flickr API call for URLs`)
    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
      flickrgroupIDs.forEach((group) => {
        flickr.groups.pools.getPhotos({
          group_id: group,
          per_page: 500,
          page: 1
        }, function(err, result) {
          if (err) {throw new Error(err)}
          result.photos.photo.forEach((bloop) => {
            flickr.photos.getInfo({
              photo_id: bloop.id
            }, function(err, result) {
              if (err) {throw new Error(err)}
              const bleep = result.photo
              if (bleep.hasOwnProperty('location')) {
                let p = bleep.location
                if (p.hasOwnProperty('neighbourhood') && p.hasOwnProperty('locality') && p.hasOwnProperty('region') && p.hasOwnProperty('country')) {
                  data[bleep.id] = {}
                  data[bleep.id]['url'] = `https://farm${bleep.farm}.staticflickr.com/${bleep.server}/${bleep.id}_${bleep.secret}.jpg`
                  data[bleep.id]['photog'] = bleep.owner.realname
                  data[bleep.id]['geo'] = bleep.location
                  data[bleep.id]['views'] = Number(bleep.views)
                  console.log(data[bleep.id])
                }
              }
            })
          })
        })
      })
      setTimeout(() => resolve("A"), 25000)
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
    let counter = 0
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
        counter += 1
        if (counter === 900) {
          setTimeout(() => 120000)
          counter = 0
        }
      })
    }
    //setTimeout(() => resolve("B"), 15000)
  })
} //palettizes URL images with an API call to Google Vision

const makeString = () => {
  return new Promise((resolve) => {
    console.log(`begin data object massaging`)
    toSave += `exports.seed = function(knex, Promise) { return knex('imagesdb').then(function () { return Promise.all([\n`
    for (let i in data) {
      const p = data[i].geo
      const s = data[i].palette
      toSave += `knex('imagesdb').insert({url: '${data[i].url}', geo: {lat: ${p.latitude}, lon: ${p.longitude}, neighbourhood: '${p.neighbourhood._content}', county: '${p.locality._content}', region: '${p.region._content}', country: '${p.country._content}'}, photog: '${data[i].photog}', views: ${data[i].views}, c1: {score: ${s[0].score}, red: ${s[0].red}, green: ${s[0].green}, blue: ${s[0].blue}}, c2: {score: ${s[1].score}, red: ${s[1].red}, green: ${s[1].green}, blue: ${s[1].blue}}, c3: {score: ${s[2].score}, red: ${s[2].red}, green: ${s[2].green}, blue: ${s[2].blue}}, c4: {score: ${s[3].score}, red: ${s[3].red}, green: ${s[3].green}, blue: ${s[3].blue}} }),\n`
    }
    toSave += ']);\n});\n};'
    setTimeout(() => resolve("C"), 1000)
  })
} //massages the object data into knex calls

const writeStream = () => {
  return new Promise((resolve) => {
    console.log(`begin write stream`)
    fs.writeFile("./seeds/10imagesdb.js", toSave, function(err) {
      if(err) {
        return console.log(err)
      }
      console.log("seed file successfully created - remember to delete the comma from the last knex call")
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
  let result = await flickrPromise()
  let result1 = await visionPromise()
  let make = await makeString()
  let write = await writeStream()
})()
