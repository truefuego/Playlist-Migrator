import React from 'react'
import { usePlaylistsStore } from '../Stores.js/PlaylistStore'
import { useSourceSinkStore } from '../Stores.js/SourceSinkStore'
import NavBar from '../Components/NavBar'
import LoadingGIF from '../Assets/loading-gif.gif'
import CompletedImage from '../Assets/complete.png'

const Summary = ({completed}) => {
  const {resetPlaylistStore} = usePlaylistsStore((state) => ({resetPlaylistStore: state.resetPlaylistStore}))
  const {resetSourceSinkStore} = useSourceSinkStore((state) => ({resetSourceSinkStore: state.resetSourceSinkStore}))
  
  const navigateToHomePage = () => {
    resetPlaylistStore()
    resetSourceSinkStore()
  }

  return (
    <div className='page'>
      <NavBar val={true}/>
      <div className='page-header'>Summary</div>
      {completed ? 
        (<div style={{display: 'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-evenly',padding:'20px'}}>
          <img src={CompletedImage} alt='Complete' style={{filter: 'invert()',height:'64px'}}/>
          <div style={{fontFamily:'"Krona One",sans-serif', color:'#f6e3ce',padding:'12px 0px 64px 0px'}}>Your playlists have been migrated.</div>
          <div className='nxt-btn' onClick={() => navigateToHomePage()}>
            Back
          </div>
        </div>) : 
        (<div style={{display: 'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-evenly',padding:'20px'}}>
          <img src={LoadingGIF} alt='loading...' style={{height:'64px'}}/>
          <div style={{fontFamily:'"Krona One",sans-serif', color:'#f6e3ce',padding:'12px 0px 64px 0px'}}>Transfering playlists</div>
        </div>)
      }
    </div>
  )
}

export default Summary