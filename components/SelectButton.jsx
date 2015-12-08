/** @jsx React.DOM */
'use strict'

module.exports = React.createClass({
  displayName: 'SelectButton',
  render: function(){
    return(
      <button type="button" className="btn btn-primary btn-xs">{this.props.children}</button>
    )
  }
})
