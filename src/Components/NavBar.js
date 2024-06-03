import React from 'react'
import { usePlaylistsStore } from '../Stores.js/PlaylistStore'
import { useSourceSinkStore } from '../Stores.js/SourceSinkStore'
import { useNavigate } from 'react-router-dom'
import './NavBar.css'

const NavBar = ({val,about=false}) => {
    const navigate = useNavigate()
    const {resetPlaylistStore} = usePlaylistsStore((state) => ({resetPlaylistStore: state.resetPlaylistStore}))
    const {resetSourceSinkStore} = useSourceSinkStore((state) => ({resetSourceSinkStore: state.resetSourceSinkStore}))

    const restart = () => {
      resetPlaylistStore()
      resetSourceSinkStore()
    }
    
    const navigateToHowToUsePage = () => {
        navigate('/how-to-use')
    }

    return (
        <div className='navbar'>
            <div className='nav-btn' style={{pointerEvents: 'none'}}>Playlist Migrator</div>
            <div style={{display: 'flex', gap: '16px'}}>
                {about && 
                <div className='nav-btn' onClick={() => navigateToHowToUsePage()}>
                    How to use
                </div>
                }
                {val && (
                <div className='nav-btn' onClick={() => restart()}>
                    Restart
                </div>)
                }
            </div>
        </div>
    )
}

export default NavBar