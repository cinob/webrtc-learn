'use strict'

let createoffer = document.querySelector('button#createOffer')

let pc = new RTCPeerConnection()
let pc2 = new RTCPeerConnection()

function getAnswer(desc) {
  console.log('answer:' + desc.sdp)

  pc2.setLocalDescription(desc)
  pc.setRemoteDescription(desc)
}

function getOffer(desc) {
  console.log('offer:' + desc.sdp)

  pc.setLocalDescription(desc)
  pc2.setRemoteDescription(desc)

  pc2.createAnswer()
    .then(getAnswer)
    .catch(handleError)
}

function getMediaStream(stream) {
  stream.getTracks().forEach((track) => {
    pc.addTrack(track)
  })

  const options = {
    offerToReceiveAudio: 0,
    offerToReceiveVidio: 1,
    iceRestart: true
  }

  pc.createOffer(options)
    .then(getOffer)
    .catch(handleError)
}

function handleError(err) {
  console.error('Failed to get Media Stream: ', err)
}

function getStream() {
  const constraints = {
    audio: false,
    video: true
  }

  navigator.mediaDevices.getUserMedia(constraints)
    .then(getMediaStream)
    .catch(handleError)
}

function test() {
  if (!pc) {
    console.error('pc is null')
    return;
  }

  getStream()

  return;
}

createoffer.onclick = test