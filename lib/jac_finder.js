export default class JacFinder {
  constructor(starting_id, ending_id, search_text) {
    this.starting_id = starting_id
    this.ending_id = ending_id
    this.search_text = search_text
  }

  run() {
    setInterval(function() {

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
  }
}
