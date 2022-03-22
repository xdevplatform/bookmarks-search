import Button from '@mui/material/Button';
import React from 'react';
import Cookies from './cookies';

export default class SignInButton extends React.Component {
  state = {token: null};

  componentDidMount() {
    const tokenKey = `${this.props.service}_token`;
    const token = Cookies.get(tokenKey);
    if (!token) {
      return;
    }

    const tokenExpiresAt = new Date(token.expires_at);
    if (tokenExpiresAt < new Date()) {
      Cookies.remove(tokenKey);
    } else {
      this.setState({token: true});
    }
  }

  render() {
    if (this.state.token) {
      return <div>Signed into {this.props.service}</div>;
    }

    return <Button variant="contained" href={this.props.href}>{this.props.children}</Button>;
    
  }
}