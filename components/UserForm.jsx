/** @jsx React.DOM */
'use strict'

module.exports = React.createClass({
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
