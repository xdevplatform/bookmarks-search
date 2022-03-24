import { Avatar, Button, Divider, Link, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import Cookies from './cookies';
import React from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import { TurnRightSharp } from '@mui/icons-material';

const url = new URL('https://api.twitter.com/2/tweets/search/recent');
url.searchParams.append('query', 'url:"https://open.spotify.com/track" -is:quote -is:retweet');
url.searchParams.append('tweet.fields', 'entities');
url.searchParams.append('expansions', 'author_id');
url.searchParams.append('user.fields', 'verified');

const spotifyUrlLookup = (tweet) => {
  if (tweet.entities && tweet.entities.urls) {
    return tweet.entities.urls.find(url => url.expanded_url && url.expanded_url.startsWith('https://open.spotify.com/track')) ?? null;
  }

  return null;
}

export default class TrackList extends React.Component {
  state = {tweets: null, error: null}
  constructor(props) {
    super(props);
    this.token = Cookies.get(`${this.props.service}_token`);
  }

  retry() {
    this.setState({error: null});
  }

  async componentDidMount() {
    await this.loadData();
  }

  async loadData() {
    let tweets = {};
    if (!this.props.tweets) {
      try {
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
        tweets = json.response;
        const data = json.response.data.map(tweet => spotifyUrlLookup(tweet) ? tweet : null).filter(tweet => tweet !== null);
        tweets.data = data;
    
        if (this.props.onTweetsReceive) {
          this.props.onTweetsReceive(tweets);
        }
      } catch (e) {
        console.warn(e);
        if (this.props.onError) {
          this.props.onError(e);
        }  
      }
    } else {
      tweets = this.props.tweets;
      const data = tweets.data.map(tweet => spotifyUrlLookup(tweet) ? tweet : null).filter(tweet => tweet !== null);
      tweets.data = data;
    }

    const ids = tweets.data.map(tweet => {
      const {expanded_url} = spotifyUrlLookup(tweet);
      
      if (expanded_url) {
        const url = new URL(expanded_url);
        return url.pathname.split('/').pop();
      }

      return null;
    }).filter(id => id !== null);

    try {
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
      
      this.setState({tracks, tweets: tweets});
    } catch (e) {
      console.error(e);
      if (this.props.onError) {
        this.props.onError(e);
      }

      this.setState({error: e});
    }



  }

  renderListItems() {
    const tweetFromTrackId = (trackId) => this.state.tweets.data.find(tweet => 
      tweet.entities.urls.find(({expanded_url}) => expanded_url?.includes(trackId)));
    const userLookup = (userId, response) => response.includes.users.find(user => user.id === userId);

    return this.state.tracks.map(track => {
      const tweet = tweetFromTrackId(track.id);
      const { username, verified } = userLookup(tweet.author_id, this.state.tweets);
      const artist = track.artists.map(({name}) => name).join(', ');
      const artwork = track.album.images[0].url;
      return <React.Fragment key={tweet.id}><ListItem alignItems='flex-start'>
        <ListItemAvatar>
          <Avatar 
            variant='square'
            alt={track.name + ' • ' + artist}
            src={artwork} />
        </ListItemAvatar>
        <ListItemText
          primary={<Link target="_blank" color="inherit" underline="hover" href={track.external_urls.spotify}>{track.name}</Link>}
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
              <Link target="_blank" underline="hover" href={`https://twitter.com/${username}/status/${tweet.id}`}>{'Tweeted by @' + username}</Link>
              {verified ? <VerifiedIcon /> : <></>}
            </React.Fragment>
          }
        />
      </ListItem><Divider /></React.Fragment>;
    }).filter(el => el !== null);
  }

  render() {
    if (this.state.error) {
      return <>
        <h2>Ooops.</h2>
        <h3>Something went wrong.</h3>
        <Button onClick={() => this.retry()}>Retry</Button>
      </>;
    }

    return this.state.tweets ? 
      <List sx={{ margin: '0 auto', maxWidth: 480, bgcolor: 'background.paper' }}>
        {this.renderListItems()}
      </List> :
      <></>;    
  }
}