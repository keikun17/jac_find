var cheerio = require('cheerio')
var ProgressBar = require('progress')
var request = require('request')
var shelljs = require('shelljs')

class JacFinder {
  constructor(starting_id, ending_id, search_text) {
    this.starting_id = starting_id
    this.ending_id = ending_id
    this.search_text = search_text
    this.base_url = "http://tracker.johnnyairplus.com/client/tracking/"

    this.bar = new ProgressBar(
      "processing [:bar] [:current of :total (:trackingid)] | :percent | eta: :etas",
      {width: 50, total: (ending_id - starting_id)}
    )
  }

  run() {
    // pointer starts with the starting id
    var pointer = this.starting_id

    setInterval(function() {
      // every 1 second, crawl jac page and increment pointer

      // halt execution if pointer is past the ending package id
      if(pointer > this.ending_id) { clearInterval(runner) }

      var url = this.base_url + pointer

      var html = request(url, function(error, response, html){

        var tracking_id = response.request.uri.pathname.split('/')[3]

        // Increment Progress bar
        this.bar.tick({
          trackingid: tracking_id
        })

        if(!error) {
          var $ = cheerio.load(html)

          var recipient_container = $('p.text:contains("Recipient:")')
          var recipient_name = recipient_container.text().replace("Recipient:   ", "")

          if (recipient_name){
            var recipient_line = ""

            if (this.search_text) {
              if (recipient_name.indexOf(this.search_text) !== -1)  recipient_line = `\n ${tracking_id} : found ${recipient_name}`

            } else {
              // If search text is given, only output if text is found
              recipient_line = `\n ${tracking_id} : found ${recipient_name}`
            }

            if (recipient_line) shelljs.echo(recipient_line)
          }

        pointer++
        }

        if(error) {
          shelljs.echo(`${tracking_id} : error`)
        }

      }.bind(this))
    }.bind(this), 1000)
  }
}

module.exports = JacFinder
