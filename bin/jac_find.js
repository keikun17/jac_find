#! /usr/bin/env node

var fs = require('fs');
var argv = require('yargs').argv
var request = require('request')
var cheerio = require('cheerio')
var shelljs = require('shelljs')

var starting_id = argv.from
var ending_id  = argv.to

var base_url = "http://tracker.johnnyairplus.com/client/tracking/"

var pointer = starting_id
var recipients = []


console.log(`Checking ${starting_id} until ${ending_id}`)
console.log('--------')

for(var pointer = starting_id; pointer < ending_id ; pointer++ ) {
  var url = base_url + pointer
  var html = request(url, function(error, response, html){
    if(!error) {
      var $ = cheerio.load(html)

      var recipient_container = $('p.text:contains("Recipient:")')
      if(recipient_container.length > 0){
        var recipient_name = recipient_container.text().replace("Recipient:   ", "")
        recipient_name = recipient_name.trim()
        if(recipient_name.length > 0){
          var tracking_id = response.request.uri.pathname.split('/')[3]
          console.log(`${tracking_id} : found ${recipient_name}`)
        }
      }

    }

    if(error) {
      // console.log(`${pointer} : error`)
    }

  })
}

