import Button from '@mui/material/Button';
import React from 'react';
import Cookies from './cookies';

export default class SignInButton extends React.Component {
  constructor(props) {
    super(props);
    this.token = Cookies.get(`${this.props.service}_token`);
  }

  render() {
    if (this.token) {
      return <div>Signed into {this.props.service}</div>;
    }

    return <Button variant="contained" href={this.props.href}>{this.props.children}</Button>;
    
  }
}