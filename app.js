var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/getData', function(req, res){
 
    console.group('inside route');

  url = 'http://www.imdb.com/title/tt4154796/';

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var title, release, rating;
      var json = { title : "", release : "", rating : ""};

      $('.title_wrapper').filter(function(){
        var data = $(this);
        title = data.children().first().text().trim();
        release = data.children().last().children().last().text().trim();

        json.title = title;
        json.release = release;
      })

      $('.ratingValue').filter(function(){
        var data = $(this);
        rating = data.text().trim();

        json.rating = rating;
      })
    }

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('Data stored in output.josn file');
    })

    fs.readFile('./output.json', handleFile)
    function handleFile(err, data) {
        if (err) throw err
        obj = JSON.parse(data)
        res.send(obj);
    }
  })
})

app.listen('8080')
console.log('server is running on 127.0.0.1:8081');
exports = module.exports = app;