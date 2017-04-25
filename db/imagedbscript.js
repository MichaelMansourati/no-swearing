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
      setTimeout(() => resolve("FlickrAPI call successful"), 10000)
    })
  })
}

const makeString = () => {
  return new Promise((resolve) => {
    toSave += `exports.seed = function(knex, Promise) { return knex('imagesdb').then(function () { return Promise.all([\n`
    for (let i in data) {
      const p = data[i].geo
      toSave += `knex('imagesdb').insert({url: '${data[i].url}', geo: {lat: ${p.latitude}, lon: ${p.longitude}, neighbourhood: '${p.neighbourhood._content}', county: '${p.county._content}', region: '${p.region._content}', country: '${p.country._content}'}, views: ${data[i].views}, palette: []),\n`
    }
    toSave += ']);\n});\n};'
    resolve("make string successful")
  })
}

(async function() {
  let result = await flickrPromise(true)
  let make = await makeString(true)
  fs.writeFile("./seeds/10imagesdb.js", toSave, function(err) {
    if(err) {
      return console.log(err)
    }
    console.log("seed file successfully created - remember to delete the comma from the last knex call")
  })
  return
})()
