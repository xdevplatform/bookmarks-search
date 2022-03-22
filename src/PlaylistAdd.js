import { Box, FormControl, InputLabel, OutlinedInput, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React from "react";
import Cookies from "./cookies";

export default class PlaylistAdd extends React.Component {
  state = {playlistName: '', error: false, loading: false};

  async createAndAdd() {
    this.setState({loading: true, error: false});
    const uris = this.props.tracks.map(({uri}) => uri);
    const {access_token} = Cookies.get('spotify_token');

    const requestConfig = {headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-type': 'application/json',
    }};

    try {
      const myUser = await fetch('https://api.spotify.com/v1/me', requestConfig);
      if (!myUser.ok) {
        throw new Error('Request failed');
      }
      const {id} = await myUser.json();
      const playlistCreate = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
        method: 'POST',
        body: JSON.stringify({name: this.state.playlistName}),
        ...requestConfig
      });
  
      if (!playlistCreate.ok) {
        throw new Error('Request failed');
      }

      const playlistCreateResponse = await playlistCreate.json();
      const playlistId = playlistCreateResponse.id;
  
      const playlistAddURL = new URL(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`);
      playlistAddURL.searchParams.append('uris', uris.join(','));
      const playlistAdd = await fetch(playlistAddURL.toString(), {method: 'POST', ...requestConfig});

      if (!playlistAdd.ok) {
        throw new Error('Request failed');
      }

      const playlistAddResponse = await playlistAdd.json();
      console.log(playlistAddResponse);
      this.setState({loading: false, error: false});
  
      if (this.props.onComplete) {
        this.props.onComplete(playlistCreateResponse);
      }  
    } catch (e) {
      console.error(e);
      this.setState({loading: false, error: true});
    }
  }

  playlistNameChange(e) {
    this.setState({playlistName: e.target.value});
  }

  render() {
    return (
      <>
      <Box component="form" novalidate autoComplete="off">
      <FormControl>
        <InputLabel htmlFor="component-outlined">Playlist name</InputLabel>
        <OutlinedInput
          id="component-outlined"
          label="Playlist name"
          onChange={(e) => this.playlistNameChange(e)}
        />
      </FormControl>
    </Box><Box>
      <LoadingButton loading={this.state.loading} disabled={this.state.playlistName === ''} onClick={() => this.createAndAdd()} variant='contained'>{this.state.error ? 'Retry' : 'Create your playlist'}</LoadingButton>
    </Box></>);
  }
}