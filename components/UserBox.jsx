/** @jsx React.DOM */
'use strict'

var React = require('react')

var UserForm = React.createClass({
  getInitialState: function() {
    return {user: ''};
  },
  handleChange: function(e){
    this.setState({user: e.target.value})
    this.props.onUserSearchChange(e.target.value)
  },
  render: function(){
    return(
        <input
          type="text"
          className="form-control"
          placeholder="ID or Handle"
          value={this.state.user}
          onChange={this.handleChange}
        />
    )
  }
})

var User = React.createClass({
  handleSelect: function(e){
    this.props.onUserSelect(this.props.user)
  },
  render: function(){
    return(
      <tr>
        <th scope="row">{this.props.user.id}</th>
        <td>{this.props.user.handle}</td>
        <td>
          <button
            type="button"
            className="btn btn-primary btn-xs"
            onClick={this.handleSelect}>
            select
          </button>
        </td>
      </tr>
    )
  }
})

var UserList = React.createClass({
  render: function(){
    var users = this.props.users;
    if (users.length < 1) {
      return (
        <div className="panel-body">
          No user found
        </div>
      )
    }else{
      var on = this.props.onUserSelect
      var userNodes = this.props.users.map(function(user) {
        return (
          <User user={user} key={user.id} onUserSelect={on}/>
        )
      })
      return (
        <table className="table table-hover">
          <tbody>
            {userNodes}
          </tbody>
        </table>
      )
    }
  }
})

module.exports = React.createClass({
  displayName: 'UserBox',
  loadUsers: function(){
    jQuery.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data){
        this.setState({data: data.payload.users, filter: this.state.filter}, function(){
          this.prepareRenderableData();
        })
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },
  prepareRenderableData: function(){
    var filter = this.state.filter;
    this.setState({
      data: this.state.data,
      renderableData: this.state.data.filter(function(d){
        return !filter || d.id == filter || d.handle.indexOf(filter) > -1
      }).slice(0,5),
      filter: this.state.filter}, function(){
        this.forceUpdate();
      });
  },
  handleUserSelect: function(user){
    var state = this.state;
    state.user = user;
    this.setState(state, function(){
      this.forceUpdate();
    });
  },
  handleUserSearchChange: function(handleOrID){
    this.setState({data: this.state.data, filter: handleOrID}, function(){
      this.prepareRenderableData();
    });
  },
  handleRepick: function(){
    var state = this.state;
    state.user = null;
    this.setState(state, function(){
      this.forceUpdate();
    });
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
            <UserForm onUserSearchChange={this.handleUserSearchChange}/>
          </div>
          <UserList users={this.state.renderableData} onUserSelect={this.handleUserSelect} />
        </div>
      )
    }else{
      return (
        <div className="panel panel-default">
          <div className="panel-heading">
            <h2>Hello <b>{this.state.user.handle}!</b></h2>
          </div>
          <div className="panel-body">
            Welcome to INF4375's twitter! Here you can :
            <p>
              <ul>
                <li>Send a tweet</li>
                <li>Remove a tweet</li>
                <li>See all your tweets</li>
                <li>Subscribe and unsubscribe to other and from user</li>
                <li>See all your subscribers and subscibees</li>
              </ul>
            </p>
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
