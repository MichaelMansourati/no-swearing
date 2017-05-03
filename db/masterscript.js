const fs = require('fs')
const request = require('request')
const dotenv = require('dotenv').config()
const flickrkey = process.env.FLICKR_API_KEY
const flickrsecret = process.env.FLICKR_API_SECRET
const flickruserid = process.env.FLICKR_USER_ID
const flickrtoken = process.env.FLICKR_ACCESS_TOKEN
const flickrtokensecret = process.env.FLICKR_ACCESS_TOKEN_SECRET
const visionkey = process.env.VISION_API_KEY
const Flickr = require("flickrapi"),
flickrOptions = {
  api_key: flickrkey,
  secret: flickrsecret,
  user_id: flickruserid,
  access_token: flickrtoken,
  access_token_secret:flickrtokensecret
}

const currGroupId = ['17242708@N00']
const flickrGroupIdMasterList = ['17242708@N00', '51829765@N00', '81344316@N00', '541622@N23'] //all 4 relevant flickr photo groups
let data = {} //each photo is its own object within this master object
let toSave = '' //the master string for the massaged data

const flickrPromise = () => {
  return new Promise((resolve) => {
    for (let i = 33; i < 37; i++) {
      console.log(`begin Flickr API call for ${currGroupId} page ${i}`)
      Flickr.authenticate(flickrOptions, function(error, flickr) {
        currGroupId.forEach((group) => {
          flickr.groups.pools.getPhotos({
            group_id: group,
            per_page: 500,
            page: i
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
                    if (bleep.owner.realname == false) {
                      data[bleep.id]['photog'] = bleep.owner.username
                    } else {
                      data[bleep.id]['photog'] = bleep.owner.realname
                    }
                    data[bleep.id]['geo'] = bleep.location
                    data[bleep.id]['views'] = Number(bleep.views)
                    console.log(data[bleep.id])
                  }
                }
              })
            })
          })
        })
      })
      setTimeout(() => resolve("A"), 30000)
    }
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
    setTimeout(() => resolve("B"), 25000)
  })
} //palettizes URL images with an API call to Google Vision

const makeString = () => {
  return new Promise((resolve) => {
    console.log(`begin data object massaging`)
    toSave += `exports.seed = function(knex, Promise) { return knex('imagesdb').then(function () { return Promise.all([\n`
    for (let i in data) {
      const p = data[i].geo
      const s = data[i].palette
      toSave += `knex('imagesdb').insert({url: '${data[i].url}', lat: ${p.latitude}, lon: ${p.longitude}, neighbourhood: "${p.neighbourhood._content}", locality: '${p.locality._content}', region: '${p.region._content}', country: '${p.country._content}', photog: "${data[i].photog}", views: ${data[i].views}, score1: ${s[0].score}, red1: ${s[0].red}, green1: ${s[0].green}, blue1: ${s[0].blue}, score2: ${s[1].score}, red2: ${s[1].red}, green2: ${s[1].green}, blue2: ${s[1].blue}, score3: ${s[2].score}, red3: ${s[2].red}, green3: ${s[2].green}, blue3: ${s[2].blue}, score4: ${s[3].score}, red4: ${s[3].red}, green4: ${s[3].green}, blue4: ${s[3].blue} }),\n`
    }
    toSave += ']);\n});\n};'
    setTimeout(() => resolve("C"), 5000)
  })
} //massages the object data into knex calls

const writeStream = () => {
  return new Promise((resolve) => {
    console.log(`begin write stream`)
    fs.writeFile("./seeds/12imagesdb.js", toSave, function(err) {
      if(err) {
        return console.log(err)
      }
      console.log("seed file successfully created")
      resolve("D")
    })
  })
} //file stream to write into the seed file

(async function() {
  await flickrPromise()
  await visionPromise()
  await makeString()
  await writeStream()
})()
