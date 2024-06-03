import React, { useEffect, useState } from 'react'
import BackImage from '../Assets/back-button.png'
import { useSourceSinkStore } from '../Stores.js/SourceSinkStore'
import { usePlaylistsStore } from '../Stores.js/PlaylistStore'
import { gapi } from 'gapi-script';
import { GoogleLogin } from 'react-google-login'
import { GenericApi } from '../Components/GenericApi'
import Summary from './Summary'
import NavBar from '../Components/NavBar'
const clientId = '334628127192-cb17obfujh46c0fc0atuaq8gp94mis63.apps.googleusercontent.com'
const API_KEY = 'AIzaSyAHcCkdC0iXi9qp0d-iorUjISddsmFuHhU'

const MigrateToSink = () => {
  const {sourceAccessToken,sourceType,sinkType,sinkAccessToken,setSinkAccessToken,setSinkUserID} = useSourceSinkStore((state) => ({sourceAccessToken:state.sourceAccessToken,sourceType:state.sourceType,sinkType: state.sinkType,sinkAccessToken:state.sinkAccessToken,setSinkAccessToken: state.setSinkAccessToken,setSinkUserID:state.setSinkUserID}))
  const {playlists} = usePlaylistsStore((state) => ({playlists: state.playlists}))  
  const {goToPreviousPage} = usePlaylistsStore((state) => ({goToPreviousPage: state.goToPreviousPage}))
  const [startMigrating,setStartMigrating] = useState(false)
  const [completed,setCompleted] = useState(false)

  const navigateToSummaryPage = async() => {
    let API_URL, PAYLOAD

    switch(sinkType) {  
      case "YOUTUBE":
        API_URL = 'https://www.googleapis.com/youtube/v3/channels?part=id&mine=true'
        PAYLOAD = {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + sinkAccessToken
          }
        }
        break;

      case "SPOTIFY": 
        API_URL = 'https://api.spotify.com/v1/me'
        PAYLOAD = {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + sinkAccessToken,
            'Accept': 'application/json'
          }
        }
        break;

      default:
        alert("Platfrom is not supported")

    }
    const userID = await GenericApi({API_URL,PAYLOAD})
    
    switch(sinkType) {
      case "YOUTUBE":
        if(!userID.items){
          alert("User Id Fetch failed!")
          return
        }
        setSinkUserID(userID.items[0].id)
        break;

      case "SPOTIFY": 
        if(!userID.id){
          alert("User Id Fetch failed!")
          return
        }
        setSinkUserID(userID.id)
        console.log(userID.id)
        break;

      default:
        alert("Platfrom is not supported")

    }
    
    if(!sinkAccessToken || !userID) {
      alert("Please login before continuing")
      return
    }

    setStartMigrating(true)

    for(let i = 0 ; i < playlists.length ; i++) {

      let res = []
      let nextPageToken = null
      let playlistTracks
      do {
        switch(sourceType) {
          case "YOUTUBE" :
            API_URL= nextPageToken !== null ? `https://youtube.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${playlists[i].id}&part=snippet&maxResults=50&pageToken=${nextPageToken}` : `https://youtube.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${playlists[i].id}&part=snippet&maxResults=50`
            PAYLOAD= {
              method: 'GET',
              headers: {
                'Authorization': sourceAccessToken,
                'Accept': 'application/json'
              }
            }
            break;

          case "SPOTIFY":
            API_URL= nextPageToken !== null ? nextPageToken : `https://api.spotify.com/v1/playlists/${playlists[i].id}`
            PAYLOAD= {
              method: 'GET',
              headers: {
                  'Authorization': 'Bearer ' + sourceAccessToken
              }
            }
            break;

          default:
            alert("Platfrom is not supported")
            
        }
        // Get PLaylist Tracks(source)
        playlistTracks = await GenericApi({API_URL,PAYLOAD})

        switch(sourceType) {
          case "YOUTUBE":
            if(playlistTracks.nextPageToken) {
              nextPageToken = playlistTracks.nextPageToken
            }
            else {
              nextPageToken = null
            }
            break;

          case "SPOTIFY": 
            if(playlistTracks.next) {
              nextPageToken = playlistTracks.next
            }
            else {
              nextPageToken = null
            }
            break;

          default:
            alert("Platfrom is not supported")
          
        }
        
        if(playlistTracks === undefined) {alert("Playlist not found");continue;}
        switch(sourceType) {
          case "YOUTUBE": 
            playlistTracks.items.forEach((item) => {res.push({name: item.snippet.title + " "+ item.snippet.videoOwnerChannelTitle})})
            break;

          case "SPOTIFY": 
            playlistTracks.tracks.items.forEach((item) => {res.push({name: item.track.name + " " + item.track.artists[0].name})})
            break;

          default:
            alert("Platform is not supported")
        }
      }
      while(nextPageToken !== null)

      playlistTracks = res
      
      
      switch(sinkType) {
        case "YOUTUBE": 
          API_URL= `https://www.googleapis.com/youtube/v3/playlists?key=${API_KEY}&part=snippet,status`
          PAYLOAD= {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sinkAccessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "snippet": {
                    "title": playlists[i].title
                },
                "status": {
                    "privacyStatus": "public"
                }
            })
          }
          break;

        case "SPOTIFY": 
          API_URL= `https://api.spotify.com/v1/users/${userID.id}/playlists`
          PAYLOAD= {
            method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + sinkAccessToken
              },
              body: JSON.stringify({
                  'name': `${playlists[i].title}`,
                  'description': `${playlists[i].title}`,
                  'public': true
              })
          }
          break;

        default:
          alert("Platform is not supported")
      }

      let newPLaylist = await GenericApi({API_URL,PAYLOAD})
      
      for(let j = 0 ; j < playlistTracks.length ; j++) {
        switch(sinkType) {
          case "YOUTUBE": 
            API_URL= `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${encodeURI(playlistTracks[j].name)}&type=video&part=snippet&maxResults=1`
            PAYLOAD= {
              method: 'GET',
            }
            break;
  
          case "SPOTIFY": 
            API_URL= `https://api.spotify.com/v1/search?q=${encodeURI(playlistTracks[j].name)}&type=track&limit=1`
            PAYLOAD= {
              method: 'GET',
              headers: {
                  'Authorization': 'Bearer ' + sinkAccessToken
              }
            }
            break;
  
          default:
            alert("Platform is not supported")
        }

        const songToBeAdded = await GenericApi({API_URL,PAYLOAD})
        
        switch(sinkType) {
          case "YOUTUBE": 
            API_URL= `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&part=snippet`
            PAYLOAD= {
              method: 'POST',
              headers: {
                  'Authorization': 'Bearer ' + sinkAccessToken,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  "snippet": {
                      "playlistId": newPLaylist.id,
                      "resourceId": {
                          "videoId": songToBeAdded.items[0].id.videoId,
                          "kind": "youtube#video"
                      }
                  }
              })
            }
            break;
  
          case "SPOTIFY": 
            API_URL= `https://api.spotify.com/v1/playlists/${newPLaylist.id}/tracks`
            PAYLOAD= {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + sinkAccessToken
              },
              body: JSON.stringify({
                  'uris': [songToBeAdded.tracks.items[0].uri]
              })
            }
            break;
  
          default:
            alert("Platform is not supported")
        }

        await GenericApi({API_URL,PAYLOAD})
      }

    }
    setCompleted(true)
  }

  const navigateToSelectSinkPage = () => {
    goToPreviousPage()
  }

  const handleSinkLogin = () => {
    const CLIENT_ID_SPOTIFY = 'dbc7f858242e4a19977a1eaa0d0fb516'
    const REDIRECT_URI_SPOTIFY = 'http://localhost:3000'
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
    const RESPONSE_TYPE_SPOTIFY = "token"
    const scopes = [
      'user-read-email',
      'user-read-private',
      'user-library-read',
      'user-library-modify',
      'playlist-modify-public',
      'playlist-modify-private'
    ]
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID_SPOTIFY}&redirect_uri=${REDIRECT_URI_SPOTIFY}&response_type=${RESPONSE_TYPE_SPOTIFY}&scope=${scopes.join("%20")}&show_dialog=true`
  }

  useEffect(() =>{
    const hash = window.location.hash

    if(hash) {
      let token = hash.substring(1).split("&")[0].split("=")[1]
        setSinkAccessToken(token)
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

  return (
      <>
      
      {startMigrating ? (<Summary completed={completed}/>) : (
      <div className='page'>
        <NavBar val={true}/>
        <div className='page-header'>Transfer</div>
        <div style={{display: 'flex',alignItems: 'center',gap: '4px'}}>
          <div className='bck-btn' onClick={() => navigateToSelectSinkPage()}>
            <img src={BackImage} alt='back'/>
          </div>
          <div className='step-text'>Step - 4/4</div>
        </div>

        {sinkAccessToken === null ? (<div style={{display:'flex',gap: '16px', padding:'24px'}}>
          {sinkType === "YOUTUBE" ? (<GoogleLogin 
            clientId={clientId}
            buttonText="Login with YouTube"
            onSuccess={(res) => {let token = gapi.auth.getToken().access_token; setSinkAccessToken(token)}}
            onFailure={(res) => console.log(res)}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
          />) : (<div className='nxt-btn' onClick={() => handleSinkLogin()}>Login with {sinkType}</div>)}
        </div>) : 
        (<div>
          <div style={{height:'48px'}}/>
          {playlists.map((item,index) => (
            <div key={item.id} className='playlist-item'>
              <div style={{display:'flex',alignItems: 'center',gap:'16px'}}>
                <img src={item.thumbnail} alt='' className='playlist-item-thumbnail'/>
                <div>{item.title}</div>
              </div>
              <div className={`playlist-item-select selected`}/>
            </div>))
          }
          <div style={{height:'48px'}}/>
        </div>
        )}

        <div className='nxt-btn' onClick={() => navigateToSummaryPage()}>
          Start Transfer
        </div>
      </div>)}
        <div style={{height:'256px',width:'100%',background:'#282828',color:"#282828",fontSize:'128px'}}>
          .
        </div>
    </>
  )
}

export default MigrateToSink