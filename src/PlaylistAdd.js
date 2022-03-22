import { PostAdd } from "@mui/icons-material";
import { Box, FormControl, InputLabel, OutlinedInput, Button } from "@mui/material";
import React from "react";
import Cookies from "./cookies";

export default class PlaylistAdd extends React.Component {
  state = {playlistName: ''}
  async createAndAdd() {
    const uris = this.props.tracks.map(({uri}) => uri);
    const {access_token} = Cookies.get('spotify_token');

    const requestConfig = {headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-type': 'application/json',
    }};

    const myUser = await fetch('https://api.spotify.com/v1/me', requestConfig);
    const {id} = await myUser.json();
    const playlistCreate = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
      method: 'POST',
      body: JSON.stringify({name: this.state.playlistName}),
      ...requestConfig
    });

    const playlistCreateResponse = await playlistCreate.json();
    const playlistId = playlistCreateResponse.id;

    const playlistAddURL = new URL(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`);
    playlistAddURL.searchParams.append('uris', uris.join(','));
    const playlistAdd = await fetch(playlistAddURL.toString(), {method: 'POST', ...requestConfig});
    const playlistAddResponse = await playlistAdd.json();
    console.log(playlistAddResponse);
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
      <Button size="large" variant="contained" disabled={this.state.playlistName === ''} onClick={() => this.createAndAdd()}>Create playlist</Button>
    </Box></>);
  }
}