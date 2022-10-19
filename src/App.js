import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = '9d1a189307f24dedaeffe23b35257742';
const CLIENT_SECRET = '57208f8db8724ba182ff6ef0f8c342d4';

function App() {
  const [ searchInput, setSearchInput] = useState("");
  const [ accessToken, setAccessToken] = useState("");
  //const [ albums, setAlbums] = useState([]);
  const [ tracks, setTracks] = useState([]);
  const [ artists, setArtist] = useState([]);

  useEffect(() => {
    //API Token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET 
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])

//busca
async function search(){

  // request usando a busca para conseguir o id do artista
  var searchParameters = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }
  var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
  .then(response => response.json())
  .then(data => { return data.artists.items[0].id})
  // request usando o id do artista para pegar todos os albuns
  //  var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
  //  .then(response => response.json())
  //  .then(data => {
  //    setAlbums(data.items);
  //  });

  var artist = await fetch('https://api.spotify.com/v1/artists?ids=' + artistID, searchParameters)
    .then(response => response.json())
    .then(data => {
      setArtist(data.artists);
    });
    console.log(artists);

  var topTracks = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?country=BR', searchParameters)
    .then(response => response.json())
    .then(data => {
      setTracks(data.tracks);
    });
    console.log(tracks)
}

// mostrar todos os albums para o usuario 
  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Busque o artista"
            type="input"
            onKeyPress={event => {
              if(event.key == "Enter"){
                search();
              }
            }}
            onChange= {event => setSearchInput(event.target.value)}
            />
            <Button onClick={search}>
              Buscar
            </Button>
        </InputGroup>
      </Container>
      <Container>
        <Card>
          <Card.Img src=""/>
        </Card>
      </Container>
      <Container>
        <Row className="mx cols-4">
            {tracks.map((track, i) => {
              return (
                <Card>
                  <Card.Body class="p-5 m-1">
                    <Card.Title>{track.name}</Card.Title>
                    <audio controls="controls">
                      <source src={track.preview_url} type="audio/mpeg"></source>
                    </audio>
                  </Card.Body>
                </Card>
              )
            })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
