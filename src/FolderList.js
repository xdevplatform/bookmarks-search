import React from "react";
import { Chip, Stack } from "@mui/material";

export default class FolderList extends React.Component {
  state = {selectedItem: null, folders: null}

  constructor(props) {
    super(props)
  }

  changeFolder(value) {
    this.setState({selectedItem: value});
    if (this.props.onFolderSelect) {

      if (value === null) {
        this.props.onFolderSelect(null, null);  
      } else {
        this.props.onFolderSelect(value, this.state.folders[value]);
      }      
    }
  }

  componentDidMount() {
    if (this.state.folders) {
      return;
    }
    const list = this.props.tweets
      .filter(({context_annotations = null}) => context_annotations)
      .map(({context_annotations}) => {
        return context_annotations.map(({domain, entity}) => {return {name: entity.name, value: `${domain.id}.${entity.id}`}});
      })
      .flat();

    const folders = {};
    for (const {name, value} of list) {
      if (!folders[name]) {
        folders[name] = [];
      }

      folders[name].push(value);
    }

    this.setState({folders});
  }

  renderFolders() {
    if (!this.state.folders) {
      return <></>;
    }

    return Object.keys(this.state.folders).map(key =>
      <Chip key={key} onClick={() => this.changeFolder(key)} variant={this.state.selectedItem === key ? 'filled' : 'outlined'} label={key} />
    );
  }

  render() {
    return <Stack spacing={1}>
      <Chip onClick={() => this.changeFolder(null)} variant={this.state.selectedItem === null ? 'filled' : 'outlined'} label='All Tweets' />
      {this.renderFolders()}
    </Stack>;
  }
}