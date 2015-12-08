/** @jsx React.DOM */
'use strict'

module.exports = React.createClass({
  displayName: 'ToggleButton',
  render: function(){
    var mode = this.props.status == "0"? "danger" : "success"
    return(
      <button type="button" className={"btn btn-" + mode + " btn-xs"}>
        {this.props.children}
      </button>
    )
  }
})
