#! /usr/bin/env node

var fs = require('fs');
var argv = require('yargs').argv
var request = require('request')
var cheerio = require('cheerio')
var shelljs = require('shelljs')
var ProgressBar = require('progress')

var base_url = "http://tracker.johnnyairplus.com/client/tracking/"
var starting_id = argv.from
var ending_id  = argv.to
var pointer = starting_id
var JacFinder = require('../lib/jac_finder.js')

var bar = new ProgressBar(
  "processing [:bar] [:current of :total (:trackingid)] | :percent | eta: :etas",
  {width: 50, total: (ending_id - starting_id)}
)

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
      var recipient_name = recipient_container.text().replace("Recipient:   ", "")

      if (recipient_name){
        var recipient_line = ""

        if (argv.text) {
          if (recipient_name.indexOf(argv.text) !== -1)  recipient_line = `\n ${tracking_id} : found ${recipient_name}`

        } else {
          recipient_line = `\n ${tracking_id} : found ${recipient_name}`
        }

        if (recipient_line) shelljs.echo(recipient_line)
      }

      pointer++
    }

    if(error) {
      shelljs.echo(`${tracking_id} : error`)
    }

  })
}, 1000)
