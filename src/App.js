import './App.css';
import React from 'react';
import SignInButton from './SignInButton';
import PlaylistAdd from './PlaylistAdd';
import TrackList from './TrackList';
 
export default class App extends React.Component {
  state = {tracks: {}}
  didReceiveTracks(tracks) {
    this.setState({tracks});
  }

  render() {
    return (
      <div className="App">
        <SignInButton href="https://127.0.0.1:5000/authorize/spotify" service="spotify">Authorize Spotify</SignInButton>
        <SignInButton href="https://127.0.0.1:5000/authorize/twitter" service="twitter">Authorize Twitter</SignInButton>
        <TrackList onTracksReceive={(tracks) => this.didReceiveTracks(tracks)}></TrackList>
        {this.state.tracks ? <PlaylistAdd tracks={this.state.tracks}></PlaylistAdd> : <></>}
      </div>
    );
  }
}