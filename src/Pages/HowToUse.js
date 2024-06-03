import React from 'react'
import NavBar from '../Components/NavBar'
import { useNavigate } from 'react-router-dom'

const HowToUse = () => {
    const navigate = useNavigate()

    const handleGoBack = () => {
        navigate('/');
    }

  return (
    <div className='page'>
        <NavBar about={false}/>
        <div className='how-to-use-info-class'>
            <div className='how-to-use-info-data'>
                <div className='how-to-use-header'>
                    HOW TO USE
                </div>
                <div className='how-to-use-data'>
                    <div>Press the “Lets Start” button on the Homepage.</div>
                    <div>On the Select Source page select the platform from where you want to transfer your playlists.</div>
                    <div>Login with your source platform ID.</div>
                    <div>Then Click on the Get Playlists button and select the playlists you want to transfer.</div>
                    <div>On the Select Sink page select the platform you want to migrate your playlists to.</div>
                    <div>Login with your sink platform ID.</div>
                    <div>You’ll be presented with the playlists that you selected to transfer. Click on the “Start Transfer” button.</div>
                    <div>On the “Summary Page” you’ll get a confirmation once the transfer is complete.</div>
                </div>
            </div>
            <div className='how-to-use-info-data'>
                <div className='how-to-use-header'>
                    HOW IT WORKS
                </div>
                <div className='how-to-use-data'>
                    <div>The migrator does not support transfer of private playlists, make your playlists public before starting the transfer, which can lead to  errors.</div>
                    <div>Once you are logged in, we use the access_token provided by the platforms to achieve the data that is necessary for the transfer process. </div>
                    <div>Getting the Users Id and Playlists, Creating playlists and adding songs to playlists are the functions used for migration process.</div>
                    <div>Make sure to click the “Back” on the summary page when the transfer is complete.</div>
                    <div>The access_tokens and user info are stored locally.</div>
                    <div>If you face any errors click the restart button to start the process from the start.</div>
                </div>
            </div>
        </div>
        <div className='nxt-btn' onClick={() => handleGoBack()}>
            BACK
        </div>
        <div style={{height:'256px',width:'100%',background:'#282828',color:"#282828",fontSize:'128px'}}>
          .
        </div>
    </div>
  )
}

export default HowToUse