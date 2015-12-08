/** @jsx React.DOM */
'use strict'

var React = require('react')
var UserForm = require('./UserForm')
var UserList = require('./UserList')
var SelectButton = require('./SelectButton')

module.exports = React.createClass({
  displayName: 'UserBox',
  loadUsers: function(){
    jQuery.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data){
        var state = this.state;
        state.data = data.payload.users
        this.setState(state, function(){
          this.prepareRenderableData()
        })
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },
  prepareRenderableData: function(){
    var filter = this.state.filter;
    filter = filter.replace(/^@+/i, '');
    var state = this.state;
    state.renderableData = this.state.data.filter(function(d){
      return !filter || d.id == filter || d.handle.indexOf(filter) > -1
    }).slice(0,5);
  },
  handleUserSelect: function(user){
    var state = this.state;
    state.user = user;
    this.props.onUserSelect(user);
    this.setState(state);
  },
  handleUserSearchChange: function(handleOrID){
    var state = this.state;
    state.filter = handleOrID;
    this.setState(state, function(){
      this.prepareRenderableData();
    });
  },
  handleRepick: function(){
    var state = this.state;
    state.user = null;
    this.props.onUserSelect(null)
    this.setState(state);
  },
  componentDidMount: function() {
    this.loadUsers();
    var state = this.state;
    state.intervalId = setInterval(this.loadUsers, this.props.pollInterval);
    this.setState(state);
  },
  componentWillUnmount: function(){
    clearInterval(this.state.intervalId);
  },
  getInitialState: function() {
    return {
      data: [],
      renderableData: [],
      filter: "",
      user: null,
      intervalId: null};
  },
  render: function(){
    if (!this.state.user) {
      return (
        <div className="panel panel-default">
          <div className="panel-heading">
            <UserForm onUserSearchChange={this.handleUserSearchChange}>
              Look for user...
            </UserForm>
          </div>
          <UserList users={this.state.renderableData} onUserClick={this.handleUserSelect}>
            <SelectButton>Select</SelectButton>
          </UserList>
        </div>
      )
    }else{
      return (
        <div className="panel panel-default">
          <div className="panel-heading">
            <h2>Hello, <b>@{this.state.user.handle}!</b></h2>
          </div>
          <div className="panel-body">
            Welcome to INF4375's twitter! Here you can :
            <ul>
              <li>Send a tweet</li>
              <li>Remove a tweet</li>
              <li>See all your tweets</li>
              <li>Subscribe and unsubscribe to other and from user</li>
              <li>See all your subscribers and subscibees</li>
            </ul>
          </div>
          <div className="panel-footer">
            <button
              type="button"
              className="btn btn-danger btn-xs"
              onClick={this.handleRepick}>
              pick another user
            </button>
          </div>
        </div>
      )
    }
  }
})
