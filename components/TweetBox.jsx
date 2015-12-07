/** @jsx React.DOM */
'use strict'

var React = require('react')

var Tweet = React.createClass({
  render: function(){
    return(
      <div className="well">
        <h3>{this.props.handle}</h3>
        <p>{this.props.message}</p>
      </div>
    )
  }
});

module.exports = React.createClass({
  displayName: 'TweetBox',
  loadTweets: function(){
    if(this.props.user){
      jQuery.ajax({
        url: this.props.url.replace("#", this.props.user.id),
        dataType: 'json',
        cache: false,
        success: function(data){
          this.setState({data: data.payload.tweets, user: this.state.user, intervalId: this.state.intervalId})
        }.bind(this),
        error: function(xhr, status, err){
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      })
    }
  },
  componentDidMount: function(){
    this.loadTweets();
    var state = this.state;
    state.intervalId = setInterval(this.loadTweets, this.props.pollInterval);
    this.setState(state);
  },
  componentWillUnmount: function(){
    clearInterval(this.state.intervalId);
  },
  getInitialState: function() {
    return {data: [], user: null, intervalId: null};
  },
  render: function(){
    if(!this.props.user){
      return(
        <div className = "panel panel-default">
          <div className="panel-heading">
            <h2>Tweets</h2>
          </div>
          <div className="panel-body">
            Select a user to see his tweets!
          </div>
        </div>
      )
    }else{
      var handle = this.props.user.handle
      return(
        <div className = "panel panel-default">
          <div className="panel-heading">
            <h2>@{handle} tweets</h2>
          </div>
          <div className="panel-body">
            {
              this.state.data.sort(function(a, b){
                 return b.timestamp - a.timestamp
              }).map(function(tweet){
                return <Tweet handle={handle} message={tweet.message} key={tweet.id} id={tweet.id}></Tweet>
              })
            }
          </div>
        </div>
      )
    }
  }
})
