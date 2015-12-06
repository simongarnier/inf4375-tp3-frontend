/** @jsx React.DOM */
'use strict'

global.jQuery = require('jquery');

var React = require('react')
var bootstrap = require('bootstrap')
var ReactDOM = require('react-dom')
var Hello = require('./components/Hello')

ReactDOM.render(<Hello />, document.getElementById('content'))
