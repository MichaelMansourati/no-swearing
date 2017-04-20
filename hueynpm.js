var image = require('get-image-data')
var dominant = require('huey/dominant')
var palette = require('huey/palette')
var huey = require('huey')
var express = require("express")
var app = express()
var PORT = process.env.PORT || 8080

const img = './testpic3.jpg'

let hex = []
huey.palette(img, 4, function(error, palette, image) {
  palette.forEach(function (rgb) {
    hex.push(rgbToHex(rgb[0], rgb[1], rgb[2]))
    console.log(rgbToHex(rgb[0], rgb[1], rgb[2]))
  })
})

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
  <head>
    <link rel="stylesheet" href="/styles/hueynpm.css" type="text/css" </link>
  </head>
  <body>
    Hello?
    <img src=${img} height="42">
    <div style="padding:40px;background-color:${hex[0]};"></div>
    <div style="padding:40px;background-color:${hex[1]};"></div>
    <div style="padding:40px;background-color:${hex[2]};"></div>
    <div style="padding:40px;background-color:${hex[3]};"></div>
  </body>`
  );
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
