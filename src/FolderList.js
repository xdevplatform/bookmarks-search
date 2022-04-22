import React from "react";
import { Chip, Stack } from "@mui/material";

export default class FolderList extends React.Component {
  state = {selectedItem: null}

  constructor(props) {
    super(props)
  }

  changeFolder(value) {
    this.setState({selectedItem: null});
  }

  render() {
    return <Stack>
      <Chip onClick={() => this.changeFolder(null)} variant={this.state.selectedItem === null ? 'filled' : 'outlined'} label='All Tweets' />
    </Stack>;
  }
}