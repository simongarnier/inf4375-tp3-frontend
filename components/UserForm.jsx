/** @jsx React.DOM */
'use strict'

module.exports = React.createClass({
  displayName: "UserForm",
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
          placeholder={this.props.children}
          value={this.state.user}
          onChange={this.handleChange}
        />
    )
  }
})
