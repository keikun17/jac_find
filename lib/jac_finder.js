'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cheerio = require('cheerio');
var ProgressBar = require('progress');
var request = require('request');
var shelljs = require('shelljs');

var JacFinder = (function () {
  function JacFinder(starting_id, ending_id, search_text) {
    _classCallCheck(this, JacFinder);

    this.starting_id = starting_id;
    this.ending_id = ending_id;
    this.search_text = search_text;
    this.base_url = "http://tracker.johnnyairplus.com/client/tracking/";

    this.bar = new ProgressBar("processing [:bar] [:current of :total (:trackingid)] | :percent | eta: :etas", { width: 50, total: ending_id - starting_id });
  }

  _createClass(JacFinder, [{
    key: 'run',
    value: function run() {
      var pointer = this.starting_id;

      setInterval((function () {

        if (pointer > this.ending_id) {
          clearInterval(runner);
        }

        var url = this.base_url + pointer;
        var html = request(url, (function (error, response, html) {

          var tracking_id = response.request.uri.pathname.split('/')[3];

          this.bar.tick({
            trackingid: tracking_id
          });

          if (!error) {

            var $ = cheerio.load(html);

            var recipient_container = $('p.text:contains("Recipient:")');
            var recipient_name = recipient_container.text().replace("Recipient:   ", "");

            if (recipient_name) {
              var recipient_line = "";

              if (this.search_text) {
                if (recipient_name.indexOf(this.search_text) !== -1) recipient_line = '\n ' + tracking_id + ' : found ' + recipient_name;
              } else {
                recipient_line = '\n ' + tracking_id + ' : found ' + recipient_name;
              }

              if (recipient_line) shelljs.echo(recipient_line);
            }

            pointer++;
          }

          if (error) {
            shelljs.echo(tracking_id + ' : error');
          }
        }).bind(this));
      }).bind(this), 1000);
    }
  }]);

  return JacFinder;
})();

module.exports = JacFinder;