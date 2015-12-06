/** @jsx React.DOM */
'use strict'

var React = require('react')

var UserForm = React.createClass({
  getInitialState: function() {
    return {user: ''};
  },
  handleChange: function(e){
    this.setState({user: e.target.value})
    this.props.onUserChange(e.target.value)
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
      var userNodes = this.props.users.map(function(user) {
        return (
          <tr key={user.id}>
            <th scope="row">{user.id}</th>
            <td>{user.handle}</td>
            <td><button type="button" className="btn btn-default btn-xs">select</button></td>
          </tr>
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
        this.setState({data: data.payload.users, user: this.state.user}, function(){
          this.prepareRenderableData();
        })
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },
  prepareRenderableData: function(){
    var user = this.state.user;
    this.setState({
      data: this.state.data,
      renderableData: this.state.data.filter(function(d){
        return !user || d.id == user || d.handle.indexOf(user) > -1
      }).slice(0,5),
      user: this.state.user});
    this.forceUpdate();
  },
  handleUserChange: function(handleOrID){
    this.setState({data: this.state.data, user: handleOrID}, function(){
      this.prepareRenderableData();
    });
  },
  componentDidMount: function() {
    this.loadUsers();
    setInterval(this.loadUsers, this.props.pollInterval);
  },
  getInitialState: function() {
    return {data: [], renderableData: [], user: ""};
  },
  render: function(){
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <UserForm onUserChange={this.handleUserChange}/>
        </div>
        <UserList users={this.state.renderableData} />
      </div>
    )
  }
})
