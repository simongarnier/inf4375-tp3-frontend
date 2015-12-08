/** @jsx React.DOM */
'use strict'

module.exports = React.createClass({
  displayName: 'ToggleButton',
  render: function(){
    var mode = this.props.status == 0 ? "success" : "danger"
    var text = this.props.status == 0 ? "subscribe" : "unsubscribe"
    return(
      <button type="button" className={"btn btn-" + mode + " btn-xs"}>
        {text}
      </button>
    )
  }
})
