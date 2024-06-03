import React from 'react'
import BackImage from '../Assets/back-button.png'
import YoutubeImage from '../Assets/youtube-logo.png'
import SpotifyImage from '../Assets/spotify-logo.png'
import { useSourceSinkStore } from '../Stores.js/SourceSinkStore'
import { usePlaylistsStore } from '../Stores.js/PlaylistStore'
import NavBar from '../Components/NavBar'

const SelectSourcePage = () => {
  const {sourceType,setSourceType,removeSourceType} = useSourceSinkStore((state) => ({sourceType: state.sourceType, setSourceType: state.setSourceType,removeSourceType: state.removeSourceType}))
  const {goToPreviousPage,goToNextPage} = usePlaylistsStore((state) => ({goToPreviousPage: state.goToPreviousPage,goToNextPage: state.goToNextPage}))

  const handleSelectSource = (Select) => {
    if(sourceType === Select) {
      removeSourceType()
    }
    else {
      setSourceType(Select)
    }
  }

  const navigateToSelectPlaylistsPage = () => {
    if(sourceType === null) {
      alert("Please Select a Source")
      return;
    }
    goToNextPage()
  }

  const navigateToHomePage = () => {
    goToPreviousPage()
  }

  return (
    <div className='page'>
      <NavBar val={true}/>
    <div className='page-header'>Select Source</div>
      <div style={{display: 'flex',alignItems: 'center',gap: '4px'}}>
        <div className='bck-btn' onClick={() => navigateToHomePage()}>
          <img src={BackImage} alt='back'/>
        </div>
        <div className='step-text'>Step - 1/4</div>
      </div>
      <div style={{display: 'flex', gap: '16px',padding: '24px',margin: "24px"}}>
        <div className={`plt-crd ${sourceType === "YOUTUBE" ? 'active' : 'inactive'}`} onClick={() => {handleSelectSource("YOUTUBE")}}>
            <img src={YoutubeImage} alt={'YOUTUBE'}/>
        </div>
        <div className={`plt-crd ${sourceType === "SPOTIFY" ? 'active' : 'inactive'}`} onClick={() => {handleSelectSource("SPOTIFY")}}>
            <img src={SpotifyImage} alt={'SPOTIFY'}/>
        </div>
      </div>
      <div className='nxt-btn' onClick={() => navigateToSelectPlaylistsPage()}>
          Next
      </div>
    </div>
  )
}

export default SelectSourcePage