const fs = require('fs')
const request = require('request')
const dotenv = require('dotenv').config()
const flickrkey = process.env.FLICKR_API_KEY
const flickrsecret = process.env.FLICKR_API_SECRET
const Flickr = require("flickrapi"),
flickrOptions = {
  api_key: flickrkey,
  secret: flickrsecret,
  requestOptions: {
    timeout: 20000,
  }
}

const flickrgroupIDs = ['17242708@N00', '51829765@N00', '81344316@N00', '541622@N23'] //all 4 relevant flickr photo groups
let data = {}

const flickrPromise = () => {
  return new Promise((resolve) => {
    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
      const group = flickrgroupIDs[1] //change this every run!
      flickr.groups.pools.getPhotos({
        group_id: group,
        per_page: 500,
        page: 1
      }, function(err, result) {
        if (err) {throw new Error(err)}
        console.log(result.photos)
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
                data[bleep.id]['geo'] = bleep.location
                data[bleep.id]['views'] = Number(bleep.views)
                if (bleep.owner.realname == false) {
                  data[bleep.id]['photog'] = bleep.owner.username
                } else {
                  data[bleep.id]['photog'] = bleep.owner.realname
                }
                console.log(data[bleep.id])
              }
            }
          })
        })
      })
      setTimeout(() => resolve("A"), 25000)
    })
  })
} //makes 2 API calls to Flickr - then adds a new object to data for each photo with geo-locations

/*
(async function() {
  let result = await flickrPromise()
})()
*/
flickrPromise()
