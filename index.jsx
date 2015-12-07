/** @jsx React.DOM */
'use strict'

global.jQuery = require('jquery');

var React = require('react')
var bootstrap = require('bootstrap')
var ReactDOM = require('react-dom')
var UserBox = require('./components/UserBox')
var TweetBox = require('./components/TweetBox')
var SubBox = require('./components/SubBox')

var App = React.createClass({
  getInitialState: function() {
    return {user: ''};
  },
  handleUserSelect: function(user){
    this.setState({user: user}, function(){
      this.forceUpdate();
    })
  },
  render: function(){
    return(
      <div className="row">
        <div className="col-md-3">
          <UserBox url="http://localhost:3000/utilisateurs/" pollInterval="1000" onUserSelect={this.handleUserSelect}/>
        </div>
        <div className="col-md-6">
          <TweetBox url="http://localhost:3000/utilisateurs/#/tweets" pollInterval="100" user={this.state.user}/>
        </div>
        <div className="col-md-3">
          <SubBox url="http://localhost:3000/abonnements/#/" pollInterval="1000" user={this.state.user}/>
        </div>
      </div>
    )
  }
})

ReactDOM.render(
  <App />,
  document.getElementById('container')
)
