#! /usr/bin/env node

var fs = require('fs');
var argv = require('yargs').argv
var request = require('request')
var cheerio = require('cheerio')
var shelljs = require('shelljs')
var ProgressBar = require('progress')

var starting_id = argv.from
var ending_id  = argv.to

var base_url = "http://tracker.johnnyairplus.com/client/tracking/"

var pointer = starting_id
var recipients = []


console.log(`Checking ${starting_id} until ${ending_id}`)
console.log('--------')

var pointer = starting_id

var bar = new ProgressBar("processing [:bar] [:current of :total (:trackingid)] | :percent | eta: :etas", {width: 50, total: (ending_id - starting_id)})

var runner = setInterval(function() {
  if(pointer > ending_id) { clearInterval(runner) }

  var url = base_url + pointer
  var html = request(url, function(error, response, html){

    var tracking_id = response.request.uri.pathname.split('/')[3]

    bar.tick({
      trackingid: tracking_id
    })

    if(!error) {
      var $ = cheerio.load(html)

      var recipient_container = $('p.text:contains("Recipient:")')
      if(recipient_container.length > 0){
        var recipient_name = recipient_container.text().replace("Recipient:   ", "")
        recipient_name = recipient_name.trim()
        if(recipient_name.length > 0){

          if(argv.text) {
            if(recipient_name.indexOf(argv.text) !== -1) {
              console.log(`\n ${tracking_id} : found ${recipient_name}`)
           }
          } else {
            console.log(`\n ${tracking_id} : found ${recipient_name}`)
          }
        }
      }

      pointer++
    }

    if(error) {
      console.log(`${tracking_id} : error`)
    }

  })
}, 1000)
