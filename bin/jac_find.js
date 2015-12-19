#! /usr/bin/env node

var fs = require('fs');
var argv = require('yargs').argv
var JacFinder = require('../lib/jac_finder.js')

var starting_id = argv.from
var ending_id  = argv.to
var search_text = argv.text

var jac_finder = new JacFinder(starting_id, ending_id, search_text)

jac_finder.run()
