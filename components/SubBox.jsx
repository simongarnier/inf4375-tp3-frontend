/** @jsx React.DOM */
'use strict'

var React = require('react')
var UserForm = require('./UserForm')
var User = require('./User')
var UserList = require('./UserList')
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
              var state = this.state;
              state.data = data
              this.setState(state, function(){
                this.prepareRenderableData()
              })
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
  prepareRenderableData: function(){
    var filter = this.state.filter;
    filter = filter.replace(/^@+/i, '');
    var state = this.state;
    state.renderableData = this.state.data.filter(function(d){
      return !filter || d.id == filter || d.handle.indexOf(filter) > -1
    }).slice(0,5);
  },
  componentDidMount: function(){
    this.loadSubscribers();
    var state = this.state;
    state.intervalId = setInterval(this.loadSubscribers, this.props.pollInterval);
    this.setState(state);
  },
  componentWillUnmount: function(){
    clearInterval(this.state.intervalId);
  },
  handleUserSearchChange: function(handleOrID){
    var state = this.state;
    state.filter = handleOrID;
    this.setState(state, function(){
      this.prepareRenderableData();
    });
  },
  handleUserSub: function(user){
    if(this.props.user){
      var type;
      if(user.subscribed == 1){
        type = 'DELETE';
      }else {
        type = 'PUT';
      }
      jQuery.ajax({
        url: this.props.subUrl + user.id,
        dataType: 'json',
        contentType: "text/plain",
        type: type,
        cache: false,
        succes:function(data) {console.log(data);}.bind(this),
        error: function(xhr, status, err){
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      })
    }
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
    var body;
    if(this.props.user){
      body = (
        <UserList users={this.state.renderableData} onUserClick={this.handleUserSub}>
          <ToggleButton/>
        </UserList>
      )
    }else{
      body = (
        <div className="panel-body">
          "Select a user to see his subscriptions!"
        </div>
      )
    }
    return(
      <div className = "panel panel-default">
        <div className="panel-heading">
          <UserForm onUserSearchChange={this.handleUserSearchChange}>
            Look for user to subscribe to...
          </UserForm>
        </div>
        {body}
      </div>
    )
  }
})
