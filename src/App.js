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
  const [ albums, setAlbums] = useState([]);

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
  console.log("Buscando por " + searchInput);

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
  .then(data => { return data.artists.items[0].id })
  console.log("O id do artista e " + artistID);

  // request usando o id do artista para pegar todos os albuns
  var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setAlbums(data.items);
    });

  // mostrar todos os albums para o usuario 
  console.log(albums); 
}


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
        <Row className="mx-2 row row-cols-4">
          {albums.map((album, i) => {
            console.log(album);
            return (
              <Card>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
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
