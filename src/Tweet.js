import React from "react";
import { Avatar, Chip, Grid, Link, Paper, Typography } from "@mui/material";
import { Verified } from "@mui/icons-material";
import { userLookup } from './utils';

export default class Tweet extends React.Component {
  render() {
    const user = userLookup(this.props.tweet.author_id, this.props.response);

    return <Link underline='none' href={`https://twitter.com/${user.username}/status/${this.props.tweet.id}`}>
    <Paper
      sx={{
        p: 2,
        margin: 'auto',
        cursor: 'pointer',
        maxWidth: 500,
        minWidth: 500,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
    <Grid container spacing={2}>
      <Grid item>
        <Avatar alt="complex" src={user.profile_image_url} />
      </Grid>
      <Grid item xs={12} sm container>
        <Grid item xs container direction="column" spacing={2}>
          <Grid item xs>
            <Typography variant="subtitle1" component="div">
              {user.name} {user.verified ? <Verified sx={{fontSize: '1rem', position: 'relative', top: '0.125rem'}} /> : <></>}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              @{user.username}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {this.props.tweet.text}
            </Typography>

          </Grid>
          <Grid item>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {new Date(this.props.tweet.created_at).toLocaleString()}
            </Typography>
            <Typography variant="body2" component='div'>
              {this.props.tweet.context_annotations ? 
                this.props.tweet.context_annotations.map(({entity}) => <Chip style={{marginRight: '0.2rem', marginBottom: '0.2rem'}} label={entity.name} size="small" variant="outlined" />) : 
                <></>}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Paper>
  </Link>
  }
}
