'use strict'

let localVideo = document.querySelector('video#localvideo')
let remoteVideo = document.querySelector('video#remotevideo')

let btnStart = document.querySelector('button#start')
let btnCall = document.querySelector('button#call')
let btnHangUp = document.querySelector('button#hangup')

let offer = document.querySelector('textarea#offer')
let answer = document.querySelector('textarea#answer')

let localStream, pc1, pc2



function getMediaStream(stream) {
  localVideo.srcObject = stream
  localStream = stream
}

function handleError(err) {
  console.log(`Failed to get Media Stream! ${err}`)
}

function start() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.log('the getUserMedia is not supported!')
    return;
  } else {
    const constraints = {
      video: true,
      audio: false
    }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(getMediaStream)
      .catch(handleError)
  }
}

function getRemoteStream(e) {
  remoteVideo.srcObject = e.streams[0]
}

function handleOfferError(err) {
  console.error('Failed to create offer ' + err)
}

function getLocalOffer(desc) {
  pc1.setLocalDescription(desc)
  offer.value = desc.sdp

  // send desc to signal
  // receive desc from signal
  
  pc2.setRemoteDescription(desc)

  pc2.createAnswer()
    .then(getAnswer)
    .catch(handleAnswerError)
}

function handleAnswerError(err) {
  console.error('Failed to create answer ' + err)
}

function getAnswer(desc) {
  pc2.setLocalDescription(desc)
  answer.value = desc.sdp

  // send desc to signal
  // receive desc from signal
  
  pc1.setRemoteDescription(desc)
}

function call() {
  pc1 = new RTCPeerConnection()
  pc2 = new RTCPeerConnection()

  pc1.onicecandidate = (e) => {
    pc2.addIceCandidate(e.candidate)
  }
  pc2.onicecandidate = (e) => {
    pc1.addIceCandidate(e.candidate)
  }

  pc2.ontrack = getRemoteStream

  localStream.getTracks().forEach((track) => {
    pc1.addTrack(track, localStream)
  })

  const offerOptions = {
    offerToRecieveAudio: 0,
    offerToRecieveVideo: 1
  }

  pc1.createOffer(offerOptions)
    .then(getLocalOffer)
    .catch(handleOfferError)

}

function hangup() {
  pc1.close()
  pc2.close()
  pc1 = null
  pc2 = null
}

btnStart.onclick = start
btnCall.onclick = call
btnHangUp.onclick = hangup

