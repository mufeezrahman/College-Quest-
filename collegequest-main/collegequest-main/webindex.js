let client = AgoraRTC.createClient({mode:'rtc','codec':"vp8"})

let config = {
    appid:'675813002f234a88a29ce17c8cf4812a',
    token:'007eJxTYGA64nO8NNbzMPOJql+8n7uP/30jlVwYLvaz6NU8Qy+m2H4FBjNzUwtDYwMDozQjY5NEC4tEI8vkVEPzZIvkNBMLQ6PEBI3nKQ2BjAzbpSKYGRkgEMTnYsjJLEstLilKTcxlYAAAAa8hRg==',
    uid:null,
    channel:'livestream',
}

let localTracks={
    audioTrack:null,
    videoTrack:null,
}


let localTracksState={
    audioTrackMuted:false,
    videoTrackMuted:false,

}
// for other to confingure and store their id 
let remoteTracks = {}


document.getElementById('join-btn').addEventListener('click',async ()=> {
    console.log('User Jonined Stream');
    await joinStreams()
})

document.getElementById('mic-btn').addEventListener('click',async()=>{
    if(!localTracksState.audioTrackMuted){
        await localTracks.audioTrack.setMuted(true)
        localTracksState.audioTrack=true
    }else{
        await localTracks.audioTrack.setMuted(false)
        localTracksState.audioTrack=false

    }

})
document.getElementById('camera-btn').addEventListener('click',async()=>{
    if(!localTracksState.videoTrackMuted){
        await localTracks.videoTrack.setMuted(true)
        localTracksState.videoTrack=true
    }else{
        await localTracks.videoTrack.setMuted(false)
        localTracksState.videoTrack=false

    }

})

document.getElementById('leave-btn').addEventListener('click',async ()=>{
    for(trackName in localTracks)
    {
        let track=localTracks[trackName]
        if(track){
            //stops both camera
            track.stop()

            //disconnect camera fom server
            track.close()
            localTracks[trackName]=null
        }
    }

    await client.leave()
    document.getElementById('user-streams').innerHTML=''
})
//connecting user to stream
let joinStreams =async() =>{

    client.on("user-published",handleUserJoined);//listens from another user
    client.on("user-left",handleUserLeft);

    [config.uid,localTracks.audioTrack,localTracks.videoTrack] = await Promise.all([
       client.join(config.appid,config.channel,config.token || null,config.uid||null),//others to join
       //create microphones
       AgoraRTC.createMicrophoneAudioTrack(),
       AgoraRTC.createCameraVideoTrack(),
    ])
    let videoplayer = `<div class="video-containers" id="video-wrapper-${config.uid}">
                          <p class="user-uid" >${config.uid}</p>
                        <div class="video-player player" id="stream-${config.uid}"></div>
                        </div>`
    document.getElementById('user-streams').insertAdjacentHTML('beforeend',videoplayer)
    localTracks.videoTrack.play(`stream-${config.uid}`)

    await client.publish([localTracks.audioTrack,localTracks.videoTrack])
    client.on("user-published", handleUserJoined)
}

let handleUserLeft = async(user)=>{
    delete remoteTracks[user.uid]
    document.getElementById(`video-wrapper-${user.uid}`)
    
}

let handleUserJoined = async (user,mediaType) =>{
    console.log('User Has Join Our Stream')
    remoteTracks[user.uid]=user
    await client.subscribe(user, mediaType)

    let videoplayer=document.getElementById(`video-wrapper-${user.uid}`)
    if(videoplayer!=null)
    {
        player.remove()
    }

    if(mediaType ==='video'){
        
    let videoplayer = `<div class="video-containers" id="video-wrapper-${user.uid}">
                          <p class="user-uid" >${user.uid}</p>
                        <div class="video-player player" id="stream-${user.uid}"></div>
                        </div>`
    document.getElementById('user-streams').insertAdjacentHTML('beforeend',videoplayer)
    user.videoTrack.play(`stream-${user.uid}`)
    }
    
    if(mediaType ==='audio'){
        user.audioTrack.play()
    }
}