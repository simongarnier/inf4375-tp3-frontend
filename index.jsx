/** @jsx React.DOM */
'use strict'

global.jQuery = require('jquery');

var React = require('react')
var bootstrap = require('bootstrap')
var ReactDOM = require('react-dom')
var UserBox = require('./components/UserBox')


ReactDOM.render(
  <div className="col-md-3">
    <UserBox url="http://localhost:3000/utilisateurs/" pollInterval="1000"/>
  </div>,
  document.getElementById('content')
)
