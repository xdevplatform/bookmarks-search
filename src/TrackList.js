import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import Cookies from './cookies';
import React from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import { CollectionsOutlined } from '@mui/icons-material';

const url = new URL('https://api.twitter.com/2/tweets/search/recent');
url.searchParams.append('query', 'url:"https://open.spotify.com/track" -is:quote -is:retweet');
url.searchParams.append('tweet.fields', 'entities');
url.searchParams.append('expansions', 'author_id');
url.searchParams.append('user.fields', 'verified');

const spotifyUrlLookup = (urls) => urls?.find(url => typeof url.unwound_url !== 'undefined' && url.unwound_url.startsWith('https://open.spotify.com/track'));

export default class TrackList extends React.Component {
  state = {tweets: null}
  constructor(props) {
    super(props);
    this.token = Cookies.get(`${this.props.service}_token`);
  }

  async componentDidMount() {
    const response = await fetch('/request', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        url: url.toString(),
        method: 'GET'
      })
    });
    
    const json = await response.json();
    
    const ids = json.response.data.map(tweet => {
      try {
        const {unwound_url} = spotifyUrlLookup(tweet.entities.urls);
        const url = new URL(unwound_url);
        return url.pathname.split('/').pop();  
      } catch (e) {
        return null;
      }
    }).filter(id => id !== null);

    const tracksURL = new URL('https://api.spotify.com/v1/tracks');
    const spotifyToken = Cookies.get('spotify_token').access_token;
    tracksURL.searchParams.append('ids', ids.join(','));
    const tracksRequest = await fetch(tracksURL.toString(), {
      headers: {
        'Authorization': `Bearer ${spotifyToken}` 
      }
    });

    const { tracks } = await tracksRequest.json();

    if (this.props.onTracksReceive) {
      this.props.onTracksReceive(tracks);
    }
    
    this.setState({tracks, tweets: json.response});
  }

  renderListItems() {
    const tweetFromTrackId = (trackId) => this.state.tweets.data.find(tweet => tweet.entities.urls.find(({unwound_url}) => unwound_url?.includes(trackId)));
    const userLookup = (userId, response) => response.includes.users.find(user => user.id === userId);

    return this.state.tracks.map(track => {
      const tweet = tweetFromTrackId(track.id);
      const { username, verified } = userLookup(tweet.author_id, this.state.tweets);
      const artist = track.artists.map(({name}) => name).join(', ');
      const artwork = track.album.images[0].url;
      return <ListItem key={tweet.id} alignItems='flex-start'>
        <ListItemAvatar>
          <Avatar 
            alt={track.name + ' • ' + artist}
            src={artwork} />
        </ListItemAvatar>
        <ListItemText
          primary={track.name}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'block' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {artist}
              </Typography>
              {'From @' + username}
              {verified ? <VerifiedIcon /> : <></>}
            </React.Fragment>
          }
        />
      </ListItem>
    }).filter(el => el !== null);
  }

  render() {
    return this.state.tweets ? 
      <List sx={{ margin: '0 auto', width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {this.renderListItems()}
      </List> :
      <></>;    
  }
}