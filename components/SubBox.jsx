/** @jsx React.DOM */
'use strict'

var React = require('react')
var UserForm = require('./UserForm')
var User = require('./User')
var ToggleButton = require('./ToggleButton')

module.exports = React.createClass({
  displayName: 'SubBox',
  loadSubscribers: function(){
    if (this.props.user) {
      jQuery.ajax({
        url: this.props.userUrl,
        dataType: 'json',
        cache: false,
        success: function(userData){
          jQuery.ajax({
            url: this.props.subUrl,
            dataType: 'json',
            cache: false,
            success: function(subData){
              var data = userData.payload.users.filter(function(user){
                if(user.id != this.props.user.id){ return user }
              }.bind(this)).map(function(user){
                  if (subData.payload.subscriptions.indexOf(user.id) == -1) {
                    user.subscribed = 0;
                    return user;
                  }else {
                    user.subscribed = 1;
                    return user;
                  }
              })
              this.setState({data: data, filter: this.state.filter});
            }.bind(this),
            error: function(xhr, status, err){
              console.error(this.props.subUrl, status, err.toString());
            }.bind(this)
          })
        }.bind(this),
        error: function(xhr, status, err){
          console.error(this.props.userUrl, status, err.toString());
        }.bind(this)
      })
    }
  },
  componentDidMount: function(){
    this.loadSubscribers();
    var state = this.state;
    state.intervalId = setInterval(this.loadSubscribers, this.props.pollInterval);
    this.setState(state);
  },
  handleUserSearchChange: function(){

  },
  getInitialState: function() {
    return {
      data: [],
      renderableData: [],
      filter: "",
      intervalId: null
    };
  },
  render: function(){
    return(
      <div className = "panel panel-default">
        <div className="panel-heading">
          <UserForm onUserSearchChange={this.handleUserSearchChange}>
            Look for subscriber...
          </UserForm>
        </div>
        <div className="panel-body">
          Select a user to see his subscriptions!
        </div>
      </div>
    )
  }
})
