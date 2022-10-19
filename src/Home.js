import React from 'react';
import { Link } from 'react-router-dom';

import styles from './styles/Home.module.css'


const Home = () =>{
  return (
      <div className={styles.homeContainer}>
        <ul>
          <li className={styles.botao}>
            <Link to="/spotify">Iniciar Spotify</Link>
          </li>
        </ul>
    </div>
  );
}


export default Home;