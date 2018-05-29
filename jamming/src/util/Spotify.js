const clientId = '24cc1920a03c415cad95c693dfa365a7';
//const redirectUri = 'http://localhost:3000/';
const redirectUri = 'http://jammingpun.surge.sh/';
let userAccessToken = '';

const Spotify = {
    search: async function(term) {
      this.getUserAccessToken();
      let url = `https://api.spotify.com/v1/search?type=track&q=${term}`;
      try {
        let response = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${userAccessToken}`
            }
          });
          if (response.ok) {
            let jsonResponse = await response.json();

            let tracks = jsonResponse.tracks.items.map(track => {
              return {
                ID: track.id,
                artist: track.artists[0].name, Name: track.name, album: track.album.name, URI: track.uri
              }
            })
            return tracks;
          }

          throw new Error('Error on retrieving data from Spotify API');
      }
      catch(error) {
        console.log(error);
      }

    },
    savePlaylist: async function(playListName, trackURIs) {

      try {

        let headers = { 'Authorization': 'Bearer ' + userAccessToken };
        let urlUserInfo = 'https://api.spotify.com/v1/me';
        let response = await fetch(urlUserInfo, {headers: headers});

        if (!response.ok) {
          throw new Error('Falied to get user info');
        }

        let userInfo = await response.json();


        //playlist creation
        headers = {...headers, 'Content-Type': 'application/json' };
        //For some reason without the cors api in the urlPlaylist the web request fails to fetch.
        //The literal error is "Failed to Fetch". Will need to conduct more research as to why this is the case
        const urlPlaylist = `https://api.spotify.com/v1/users/${userInfo.id}/playlists`;
        response = await fetch(urlPlaylist,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userAccessToken}`,
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          body: JSON.stringify({name: playListName})
        });

        if(!response.ok) {
          throw new Error('Failed to create playlist');
        };

        let playlistInfo = await response.json();
            let playlistId = playlistInfo.id;
            const urlPlaylistTracks = `https://api.spotify.com/v1/users/${userInfo.id}/playlists/${playlistId}/tracks`;
            response = await fetch(
                urlPlaylistTracks,
                {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ uris: trackURIs })
                });
            if (!response.ok) {
                throw new Error('Fail to add tracks to playlist');
            }

      } catch (error) {
        console.log('Failed to Post')
        console.log(error);
      }

    },
    getUserAccessToken: function () {
    if (userAccessToken) {
      return userAccessToken;
    }
    else if (window.location.href.match(/access_token=([^&*])/) != null) {
      userAccessToken = window.location.href.match(/access_token=([^&]*)/)[0].split("=")[1];
      let expiresIn = window.location.href.match(/expires_in=([^&]*)/)[0].split("=")[1];
      window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
      window.history.pushState('Acess Token', null, '/');
    }
    else {
      const authUri = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      console.log(authUri);
      window.location.href = authUri;
    }

}
};




export default Spotify;
