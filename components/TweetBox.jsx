/** @jsx React.DOM */
'use strict'

var React = require('react')

var Tweet = React.createClass({
  handleDelete: function(){
    this.props.onTweetDelete(this.props.id)
  },
  render: function(){
    return(
      <div className="well">
        <h3>{this.props.handle}</h3>
        <p>{this.props.message}</p>
        <p style={{opacity: 0.4}}>
          {Math.floor(((Date.now() / 1000 | 0) - this.props.timestamp)/60)} minutes ago
        </p>
        <span style={{opacity: 0.4}} className="glyphicon glyphicon-remove" aria-hidden="true" onClick={this.handleDelete}></span>
      </div>
    )
  }
});

var TweetForm = React.createClass({
  getInitialState: function(){
    return {message: ''};
  },
  handleMessageChange: function(e){
    this.setState({message: e.target.value})
  },
  handleSubmit: function(e){
    e.preventDefault();
    var message= this.state.message.trim();
    if(!message){return}
    this.props.onTweetSubmit({message: message})
    this.setState({message:''})
  },
  render: function(){
    var disabled = this.state.length < 1 ? "disabled" : null
    return (
      <form className="form-horizontal"  onSubmit={this.handleSubmit} >
        <div className="form-group">
          <div className="col-sm-12">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Message..."
              onChange={this.handleMessageChange}
              value={this.state.message}></textarea>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-4">
            <button type="submit" className="btn btn-primary btn-xs">Tweet your message!</button>
          </div>
          <div className="col-sm-8" style={{opacity: this.state.message.length/144, textAlign: "right"}}>
            {this.state.message.length} characters
          </div>
        </div>
      </form>
    )
  }
});

module.exports = React.createClass({
  displayName: 'TweetBox',
  loadTweets: function(){
    if(this.props.user){
      jQuery.ajax({
        url: this.props.url,
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
  handleTweetSubmit: function(tweet){
    if(this.props.user){
      jQuery.ajax({
        url: this.props.url,
        dataType: 'json',
        contentType: "text/plain",
        type: 'POST',
        data: JSON.stringify(tweet),
        cache: false,
        succes:function(data) {console.log(data);}.bind(this),
        error: function(xhr, status, err){
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      })
    }
  },
  handleTweetDelete: function(tweetId){
    if(this.props.user){
      jQuery.ajax({
        url: this.props.url + tweetId,
        contentType: "text/plain",
        type: 'DELETE',
        cache: false,
        succes:function(data) {console.log(data);}.bind(this),
        error: function(xhr, status, err){
          console.error(this.props.url+tweetId, status, err.toString());
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
      var deleteCallback = this.handleTweetDelete;
      return(
        <div className = "panel panel-default">
          <div className="panel-heading">
            <h2>@{handle} tweets</h2>
          </div>
          <div className="panel-body">
            <TweetForm onTweetSubmit={this.handleTweetSubmit}/>
            {
              this.state.data.sort(function(a, b){
                 return b.timestamp - a.timestamp
              }).map(function(tweet){
                return <Tweet
                  handle={handle}
                  message={tweet.message}
                  key={tweet.id}
                  id={tweet.id}
                  timestamp={tweet.timestamp}
                  onTweetDelete={deleteCallback}></Tweet>
              })
            }
          </div>
        </div>
      )
    }
  }
})
