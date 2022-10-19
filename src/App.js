import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import styles from "./styles/Spotify.module.css";

const CLIENT_ID = '9d1a189307f24dedaeffe23b35257742';
const CLIENT_SECRET = '57208f8db8724ba182ff6ef0f8c342d4';

function App() {
  const [ searchInput, setSearchInput] = useState("");
  const [ accessToken, setAccessToken] = useState("");
  //const [ albums, setAlbums] = useState([]);
  const [ tracks, setTracks] = useState([]);
  const [ artists, setArtist] = useState([]);
  const [ searchStatus, setSearchStatus] = useState(false);
  let classSearchStatus = searchStatus ? '' : styles.container

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
    //console.log(artists);

  var topTracks = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?country=BR', searchParameters)
    .then(response => response.json())
    .then(data => {
      setTracks(data.tracks);
    });
    console.log(tracks)   
    
   
}

function searchClasses(){
  if(searchStatus == false && searchInput !== '')
    setSearchStatus(searchStatus => !searchStatus);
  search();
}

// mostrar todos as tracks para o usuario 
  return (
    <div className="App">
    <Container className={classSearchStatus}>
      <Container>
        <InputGroup className={styles.input} size="lg">
          <FormControl
            placeholder="Busque o artista"
            type="input"
            onKeyPress={event => {
              if(event.key == "Enter"){
                searchClasses();
              }
            }}
            onChange= {event => setSearchInput(event.target.value)}
            />
            <Button onClick={searchClasses}>
              Buscar
            </Button>
        </InputGroup>
      </Container>
      <Container className="column col-3 mt-4">
        {
          artists.map((artist, i) => {
            return (
              <Card className={styles.background}>
                <Card.Img className="rounded-circle center img-fluid p-4"
                  src={artist.images[0].url}
                />
              <Card.Title className="mt-2 mb-4 font-weight-bold">
                {artist.name}
              </Card.Title>
              <Card.Body>
                <a href={'https://open.spotify.com/artist/' + artist.id} target="_noblank">Ver no Spotify</a>
              </Card.Body>
              </Card>
            )
          })
        }
      </Container>
      <Container>
        <Row className="mx cols-4">
            {tracks.map((track, i) => {
              return (
                <Card className={styles.background}>
                  <Card.Body className="p-5 m-1">
                    <Card.Title className="mb-4">{track.name}</Card.Title>
                    <audio controls="controls">
                      <source src={track.preview_url} type="audio/mpeg"></source>
                    </audio>
                  </Card.Body>
                  <Card.Body>
                    <a href={track.external_urls.spotify} target="_noblank">Ouvir no Spotify</a>
                  </Card.Body>
                </Card>
              )
            })}
        </Row>
        </Container>
      </Container>
    </div>
  );
}

export default App;
