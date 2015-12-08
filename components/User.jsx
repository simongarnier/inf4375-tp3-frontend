/** @jsx React.DOM */
'use strict'

module.exports = React.createClass({
  displayName: 'User',
  handleClick: function(e){
    this.props.onUserClick(this.props.user)
  },
  render: function(){
    return(
      <tr onClick={this.handleClick}>
        <th scope="row">{this.props.user.id}</th>
        <td>@{this.props.user.handle}</td>
        <td>{this.props.children}</td>
      </tr>
    )
  }
});
