import React from 'react'
import { usePlaylistsStore } from '../Stores.js/PlaylistStore'
import WEBSITE_LOGO from '../Assets/website-logo.png'
import YoutubeImage from '../Assets/youtube-logo.png'
import SpotifyImage from '../Assets/spotify-logo.png'
import NavBar from '../Components/NavBar'

const HomePage = () => {
  const {goToNextPage} = usePlaylistsStore((state) => ({goToNextPage: state.goToNextPage}))

  const navigateToSelectSourcePage = () => {
    goToNextPage()
  }

  return (
    <div className='page'>
      <NavBar val={false} about={true}/>
      <div className='logo-item'>
        <img src={WEBSITE_LOGO} alt='logo' />
      </div>
      <div className='pltform-list'>
        <img src={SpotifyImage} alt='SPOTIFY' />
        <img src={YoutubeImage} alt='YOUTUBE' />
      </div>
      <div className='nxt-btn' onClick={() => navigateToSelectSourcePage()}>Let's Start</div>
    </div>
  )
}

export default HomePage