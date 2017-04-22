var image = require('get-image-data')
var dominant = require('huey/dominant')
var palette = require('huey/palette')
var huey = require('huey')
var express = require("express")
var ejs = require('ejs')
var app = express()
var nodemon = require('nodemon')
var PORT = process.env.PORT || 8080



// app.get("/", (req, res) => {
//   res.render("index");
// });

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/views'))

app.get('/', function(req, res) {
  res.render('index')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
