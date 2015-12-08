/** @jsx React.DOM */
'use strict'
var User = require('./User')

module.exports = React.createClass({
  displayName: 'UserList',
  render: function(){
    var users = this.props.users;
    if (users.length < 1) {
      return (
        <div className="panel-body">
          No user found
        </div>
      )
    }else{
      var on = this.props.onUserClick
      var children = this.props.children
      var userNodes = this.props.users.map(function(user) {
        if (user.subscribed) {
          children = cloneElement(children, {status: user.subscribed})
        }
        return (
          <User user={user} key={user.id} onUserClick={on}>
            {children}
          </User>
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
