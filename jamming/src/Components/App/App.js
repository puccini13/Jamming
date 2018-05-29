import React, { Component } from 'react';
import './App.css';
import SearchBar from './../SearchBar/SearchBar'
import SearchResults from './../SearchResults/SearchResults'
import Playlist from './../Playlist/Playlist'
import Spotify from './../../util/Spotify'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

    //Update the state of the playlistTracks
    this.state.playlistTracks.push(track);

    this.setState({
      playlistTracks: this.state.playlistTracks
    });
  };

  removeTrack(track) {

    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
        var elementPos = this.state.playlistTracks.map(savedTrack => {
          if (savedTrack.id === track.id) {return track.id}
        }).indexOf(track.id);

        this.state.playlistTracks.splice(elementPos, 1);
        this.setState({
          playlistTracks: this.state.playlistTracks
        })
    }
  };

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  };

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.URI);
    if(trackUris.length > 0) {
      Spotify.savePlaylist(this.state.playlistName, trackUris).then(results => {
        this.setState({ searchResults: [], playlistName: 'New Playlist', playlistTracks: [] });

      });
    } else {
      console.log('No tracks to add');
    }


  };

  search(searchTerm) {
      if(searchTerm !== '') {
        Spotify.search(searchTerm).then(results => {
          this.setState({ searchResults: results })
        });
      }
      else {
        this.setState({ searchResults: [] })
      }
  };

  render() {
    return (
      <div>
       <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
          <SearchResults searchResults = {this.state.searchResults} onAdd={this.addTrack} />
          <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}
                    onRemove={this.removeTrack} onNameChange={this.updatePlaylistName}
                    onSave={this.savePlaylist}/>
         </div>
        </div>
     </div>
    );
  }
}

export default App;
