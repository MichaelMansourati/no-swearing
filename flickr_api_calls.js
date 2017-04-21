var Flickr = require("flickrapi"),
flickrOptions = {
  api_key: "INSERT YOUR API KEY HERE",
  secret: "INSERT YOUR SECRET KEY HERE",
  requestOptions: {
    timeout: 20000,
    /* other default options accepted by request.defaults */
  }
};

const flickrgroupIDs = ['17242708@N00', '51829765@N00', '81344316@N00', '541622@N23']
//all 4 relevant flickr photo groups

Flickr.tokenOnly(flickrOptions, function(error, flickr) {
  /*
  flickr.groups.pools.getPhotos({
    group_id: flickrgroupIDs[0],
    per_page: 10,
    page: 1
  }, function(err, result) {
    if (err) {throw new Error(err)}
    //console.log(result.photos.photo)
    result.photos.photo.forEach((bloop) => {
      console.log(`https://farm${bloop.farm}.staticflickr.com/${bloop.server}/${bloop.id}_${bloop.secret}.jpg`)
    })
  }) //gets a whole host of URLs
  */

  /*
  flickr.photos.getInfo({
    photo_id: '33955924131'
  }, function(err, result) {
    if (err) {throw new Error(err)}
    // result.photo.location.forEach((bloop) => {
    //   console.log(bloop)
    // })
    console.log(result.photo.location)
  }) //gets a single photo's location!
  */

  /*
  flickr.urls.lookupGroup({
    url: 'https://www.flickr.com/groups/urban_toronto/'
  }, function(err, result) {
    if (err) {throw new Error(err)}
    console.log(result)
  }) //gets the specific group ID
  */

  /*
  flickr.photos.search({
    lat: 43.6532,
    lon: 79.3832,
    radius: 20,
    sort: 'relevance',
    user_id: '34608255@N08'
  }, function(err, result) {
    if(err) { throw new Error(err); }
    // do something with result
    //console.log(result.photos.photo)
    result.photos.photo.forEach((bloop) => {
      console.log(`https://farm${bloop.farm}.staticflickr.com/${bloop.server}/${bloop.id}_${bloop.secret}.jpg`)
    })
  }) //general photo search.. we dont really wanna use this one LUL
  */
});
