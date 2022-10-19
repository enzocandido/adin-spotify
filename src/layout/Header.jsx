import styles from '../styles/Header.module.css'
import spotify_logo from '../images/spotify_logo.png'
import { Link } from 'react-router-dom';

import { AiFillHome } from "react-icons/ai";



export default function Header() {
    return(
        <div className={styles.headerContainer} >
            <div>
                <img src={spotify_logo} to="/" alt="Spotify"></img>
            </div>
            <div>
                <h3><Link to="/"><AiFillHome color='#fff' width={'100px'}/></Link></h3>
            </div>
        </div>
    )
}