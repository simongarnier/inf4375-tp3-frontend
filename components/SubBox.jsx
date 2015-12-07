/** @jsx React.DOM */
'use strict'

var React = require('react')

module.exports = React.createClass({
  displayName: 'SubBox',
  getInitialState: function() {
    return {data: []};
  },
  render: function(){
    return(
      <div className = "panel panel-default">
        <div className="panel-heading">
          <h2>Subscribtions</h2>
        </div>
        <div className="panel-body">
          Select a user to see his subscriptions!
        </div>
      </div>
    )
  }
})
