const dotenv = require('dotenv').config()
const flickrkey = process.env.FLICKR_API_KEY
const flickrsecret = process.env.FLICKR_API_SECRET
const flickruserid = process.env.FLICKR_USER_ID
const flickrtoken = process.env.FLICKR_ACCESS_TOKEN
const flickrtokensecret = process.env.FLICKR_ACCESS_TOKEN_SECRET
const Flickr = require('flickrapi'),
flickrOptions = {
  api_key: flickrkey,
  secret: flickrsecret,
  user_id: flickruserid,
  access_token: flickrtoken,
  access_token_secret:flickrtokensecret,
  requestOptions: {
    timeout: 20000,
  }
}

const currGroupId = ['17242708@N00']
let data = {}

const flickrPromise = () => {
  return new Promise((resolve) => {
    for (let i = 21; i < 25; i++) {
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
}  //makes 2 API calls to Flickr - then adds a new object to data for each photo with geo-locations

flickrPromise()
