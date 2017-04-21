var request = require('request');
var http    = require('http')
var fs      = require('fs');
var data    = "";


function getRepoContributors(cb) {

  // request.post(
  //   'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC3P4ocBwu49KTsLRTwg-Ngj97vl1oH-aI',
   requestBody = {
     "requests": [
      {
       "features": [
        {
         "type": "IMAGE_PROPERTIES"
        }
       ],
       "image": {
        "source": {
         "gcsImageUri": "gs://image_palettizer/alina_baraz.jpg",
         // https://images.pexels.com/photos/66997/pexels-photo-66997.jpeg?w=940&h=650&auto=compress&cs=tinysrgb"
        }
       }
      }
     ]
    }
    // , cb);

  request.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC3P4ocBwu49KTsLRTwg-Ngj97vl1oH-aI",
    {data: requestBody}, cb);
// postman

}


getRepoContributors(function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(response)
        }
    });