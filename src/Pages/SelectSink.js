import React from 'react'
import BackImage from '../Assets/back-button.png'
import YoutubeImage from '../Assets/youtube-logo.png'
import SpotifyImage from '../Assets/spotify-logo.png'
import { useSourceSinkStore } from '../Stores.js/SourceSinkStore'
import { usePlaylistsStore } from '../Stores.js/PlaylistStore'
import NavBar from '../Components/NavBar'

const SelectSink = () => {
  const {sourceType,sinkType,setSinkType,removeSinkType} = useSourceSinkStore((state) => ({sourceType:state.sourceType, sinkType: state.sinkType, setSinkType: state.setSinkType, removeSinkType: state.removeSinkType}))
  const {goToPreviousPage,goToNextPage} = usePlaylistsStore((state) => ({goToPreviousPage: state.goToPreviousPage,goToNextPage: state.goToNextPage}))

  const handleSinkSelect = (Select) => {
    if(sinkType === Select) {
      removeSinkType()
    }
    else {
      setSinkType(Select)
    }
  }

  const navigateToTransferPage = () => {
    if(!sinkType) {
      alert("Please Select A Destination!")
      return;
    }
    goToNextPage()
  }

  const navigateToSelectPlaylistsPage = () => {
    goToPreviousPage()
  }

  return (
    <div className='page'>
      <NavBar val={true}/>
      <div className='page-header'>Select Destination</div>
      <div style={{display: 'flex',alignItems: 'center',gap: '4px'}}>
        <div className='bck-btn' onClick={() => navigateToSelectPlaylistsPage()}>
          <img src={BackImage} alt='back'/>
        </div>
        <div className='step-text'>Step - 3/4</div>
      </div>
      <div style={{display: 'flex', gap: '16px',padding: '24px'}}>
        <div className={`plt-crd ${sinkType === "YOUTUBE" ? 'active' : 'inactive'} ${sourceType === "YOUTUBE" ? 'disabled' : ''}`} onClick={() => {handleSinkSelect("YOUTUBE")}}>
            <img src={YoutubeImage} alt={'YOUTUBE'}/>
        </div>
        <div className={`plt-crd ${sinkType === "SPOTIFY" ? 'active' : 'inactive'} ${sourceType === "SPOTIFY" ? 'disabled' : ''}`} onClick={() => {handleSinkSelect("SPOTIFY")}}>
            <img src={SpotifyImage} alt={'SPOTIFY'}/>
        </div>
      </div>
      <div className='nxt-btn' onClick={() => navigateToTransferPage()}>
        Next
      </div>
    </div>
  )
}

export default SelectSink