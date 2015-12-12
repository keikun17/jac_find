#! /usr/bin/env node

var fs = require('fs');
var argv = require('yargs').argv
var request = require('request')
var cheerio = require('cheerio')
var shelljs = require('shelljs')

var starting_id = argv.from
var ending_id  = argv.to

console.log(`from ${argv.from}`)
console.log(`to ${argv.to}`)

var base_url = "http://tracker.johnnyairplus.com/client/tracking/"

var pointer = starting_id
var recipients = []


console.log(`Checking ${starting_id} until ${ending_id}`)
do {
  var url = base_url + pointer
  var html = request(url, function(error, response, html){
    if(!error) {
      var $ = cheerio.load(html)
      var recipient = $('p.text:contains("Recipient:")')
      if(recipient.length > 0){
        console.log(`${pointer} : found ${recipient.text()}`)
      }
    }

    if(error){
      console.log(`error processing ${url} :`)
      consooe.log(error)
    }

  })

  pointer = pointer + 1
} while (pointer <= ending_id)

