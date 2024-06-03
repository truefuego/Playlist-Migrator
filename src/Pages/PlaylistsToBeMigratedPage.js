import React, { useEffect, useState } from 'react'
import BackImage from '../Assets/back-button.png'
import { useSourceSinkStore } from '../Stores.js/SourceSinkStore'
import { gapi } from 'gapi-script';
import { GoogleLogin } from 'react-google-login';
import { GenericApi } from '../Components/GenericApi';
import { usePlaylistsStore } from '../Stores.js/PlaylistStore';
import NavBar from '../Components/NavBar';
const clientId = process.env.CLIENT_ID
const API_KEY = process.env.API_KEY
const scopes = "https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtube.force-ssl"

const PlaylistsToBeMigrated = () => {
  const {sourceType,sourceAccessToken,setSourceUserID,setSourceAccessToken} = useSourceSinkStore((state) => ({setSourceUserID:state.setSourceUserID,sourceType: state.sourceType,sourceAccessToken: state.sourceAccessToken,setSourceAccessToken:state.setSourceAccessToken}))
  const [sourcePlaylists,setSourcePlaylists] = useState([]);  
  const {goToPreviousPage,goToNextPage,setPlaylists} = usePlaylistsStore((state) => ({setPlaylists: state.setPlaylists,goToPreviousPage: state.goToPreviousPage,goToNextPage: state.goToNextPage}))

  const navigateToSelectSinkPage = () => {
    if(!sourceAccessToken && sourcePlaylists.length === 0) {
      alert("Login or Input playlist ID!")
      return
    }
    let playlistsToBeAdded = [...sourcePlaylists.filter((item) => {return item.selected === true})]
    setPlaylists(playlistsToBeAdded)
    goToNextPage()
  }

  const navigateToSelectSourcePage = () => {
    goToPreviousPage()
  }

  const togglePlaylist = (index) => {
    setSourcePlaylists(prev => {
      return prev.map((item,i) => i === index ? {...item,selected: !item.selected} : item)
    })
  }

  const GetSourcePlaylists = async() => {
    let API_URL, PAYLOAD

    switch(sourceType) {  
      case "YOUTUBE":
        API_URL = 'https://www.googleapis.com/youtube/v3/channels?part=id&mine=true'
        PAYLOAD = {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + sourceAccessToken
          }
        }
        break;

      case "SPOTIFY": 
        API_URL = 'https://api.spotify.com/v1/me'
        PAYLOAD = {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + sourceAccessToken,
            'Accept': 'application/json'
          }
        }
        break;

      default:
        alert("Platfrom is not supported")

    }
    const userID = await GenericApi({API_URL,PAYLOAD})
    
    switch(sourceType) {
      case "YOUTUBE":
        if(!userID.items){
          alert("User Id Fetch failed!")
          return
        }
        setSourceUserID(userID.items[0].id)
        console.log(userID.items[0].id)
        break;

      case "SPOTIFY": 
        if(!userID.id){
          alert("User Id Fetch failed!")
          return
        }
        setSourceUserID(userID.id)
        console.log(userID.id)
        break;

      default:
        alert("Platfrom is not supported")

    }
    
    if(!sourceAccessToken || !userID) {
      alert("Please login before continuing")
      return
    }

    switch(sourceType) {
      case "YOUTUBE": 
        API_URL = `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&maxResults=50&channelId=${userID.items[0].id}&key=${API_KEY}`
        PAYLOAD = {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + sourceAccessToken,
            'Accept': 'application/json'
          }
        }
        break;
    
      case "SPOTIFY": 
        API_URL = `https://api.spotify.com/v1/users/${userID.id}/playlists`
        PAYLOAD = {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + sourceAccessToken
          }
        }
        break;

      default:
        alert("Platfrom is not supported")

    }

    let playlists = await GenericApi({API_URL,PAYLOAD})
    
    console.log(playlists)
    if(!playlists.items || !playlists) {
      alert("Error in Fetching PLaylists")
      return
    }

    let res = []
    switch(sourceType) {
      case "YOUTUBE": 
        if(playlists && playlists.items) {
          playlists.items.map((item) => {
            if (item.snippet && item.snippet.thumbnails) {
              res.push({title: item.snippet.title, id: item.id, thumbnail: item.snippet.thumbnails.default.url,selected: false})
            } else {
              res.push({title: item.snippet.title, id: item.id, thumbnail: 'https://static.vecteezy.com/system/resources/previews/023/986/704/non_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png',selected: false})
            }
          })
        }
        console.log(res)
        break;

      case "SPOTIFY": 
        if(playlists && playlists.items) {
          playlists.items.map((item) => {
            if (item.images && item.images.length >= 2) {
              res.push({title: item.name, id: item.id, thumbnail: item.images[2].url,selected: false})
            } else {
              res.push({title: item.name, id: item.id, thumbnail: 'https://developer.spotify.com/images/guidelines/design/icon3@2x.png',selected: false})
            }
          })
        }
        console.log(res)
        break;

      
      default:
        alert("Platfrom is not supported")
    }
    playlists = res

    if(!playlists || playlists.length === 0) {
      alert("No playlists Found! Please select a playlist")
    }

    setSourcePlaylists(playlists)
  }

  useEffect(() =>{
    const hash = window.location.hash

    if(hash) {
      let token = hash.substring(1).split("&")[0].split("=")[1]
        setSourceAccessToken(token)
        window.location.hash = ""
    }
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      })
    }
    gapi.load('client:auth2',start)
  }, [])


  const handleSourceLogin = () => {
    const CLIENT_ID_SPOTIFY = 'dbc7f858242e4a19977a1eaa0d0fb516'
    const REDIRECT_URI_SPOTIFY = process.env.REDIRECT_URI
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
    const RESPONSE_TYPE_SPOTIFY = "token"
    const scopes = ['user-read-email','user-read-private','user-library-read','user-library-modify','playlist-modify-public','playlist-modify-private']
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID_SPOTIFY}&redirect_uri=${REDIRECT_URI_SPOTIFY}&response_type=${RESPONSE_TYPE_SPOTIFY}&scope=${scopes.join("%20")}&show_dialog=true`
  }

  return (
    <div className='page'>
      <NavBar val={true}/>
      <div className='page-header'>Select Playlists</div>
      <div style={{display: 'flex',alignItems: 'center',gap: '4px'}}>
        <div className='bck-btn' onClick={() => navigateToSelectSourcePage()}>
          <img src={BackImage} alt='back'/>
        </div>
        <div className='step-text'>Step - 2/4</div>
      </div>


      {sourceAccessToken === null && (<div style={{display:'flex',gap: '16px', padding:'24px'}}>
        {sourceType === "YOUTUBE" ? 
          (<GoogleLogin 
            clientId={clientId}
            buttonText="Login with YouTube"
            scope={scopes}
            onSuccess={(res) => {let token = gapi.auth.getToken().access_token; setSourceAccessToken(token)}}
            onFailure={(res) => console.log(res)}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
          />) : 
          (<div className='nxt-btn' onClick={() => handleSourceLogin()}>Login with {sourceType}</div>)}
      </div>)}


      {sourceAccessToken !== null && sourcePlaylists.length === 0 && (<div className='nxt-btn' style={{margin: '64px 0 0 0'}} onClick={() => GetSourcePlaylists()}>Get Playlists</div>)}


      {sourcePlaylists.length !== 0 && (
      <div>
        <div style={{height:'48px'}}/>
        <div style={{border: '1px solid #7d7266'}}>
          {sourcePlaylists.map((item,index) => (
            <div key={item.id} className='playlist-item'>
              <div style={{display:'flex',alignItems: 'center',gap:'16px'}}>
                <img src={item.thumbnail} alt='' className='playlist-item-thumbnail'/>
                <div>{item.title}</div>
              </div>
              <div onClick={() => {togglePlaylist(index)}} className={`playlist-item-select ${item.selected ? 'selected' : ''}`}/>
            </div>))
          }
        </div>
        <div style={{height:'48px'}}/>
      </div>)}


      {sourcePlaylists.length !== 0 && (<div className='nxt-btn' onClick={() => navigateToSelectSinkPage()}>
        Select Destination
      </div>)}
        <div style={{height:'256px',width:'100%',background:'#282828',color:"#282828",fontSize:'128px'}}>
          .
        </div>
    </div>
  )
}

export default PlaylistsToBeMigrated