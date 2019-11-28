'use strict'

// devices
const audioSource = document.querySelector('select#audioSource')
const audioOutput = document.querySelector('select#audioOutput')
const videoSource = document.querySelector('select#videoSource')
// filter
const filtersSelect = document.querySelector('select#filter')

// picture
const snapshot = document.querySelector('button#snapshot')
const picture = document.querySelector('canvas#picture')
picture.width = 640
picture.height = 480

const videoplay = document.querySelector('video#player')
// const audioplay = document.querySelector('audio#audioplayer')

const divConstraints = document.querySelector('div#constraints')

// recored
const recvideo = document.querySelector('video#recplayer')
const btnRecord = document.querySelector('button#record')
const btnPlay = document.querySelector('button#recplay')
const btnDownload = document.querySelector('button#download')

var buffer
var mediaRecorder

function gotDevices(deviceInfos) {
  deviceInfos.forEach(function (deviceInfo) {
    let option = document.createElement('option')
    option.text = deviceInfo.label
    option.value = deviceInfo.deviceId
    if (deviceInfo.kind === 'audioinput') {
      audioSource.appendChild(option)
    } else if (deviceInfo.kind === 'audiooutput') {
      audioOutput.appendChild(option)
    } else if (deviceInfo.kind === 'videoinput') {
      videoSource.appendChild(option)
    }
  })
}

function gotMediaStream(stream) {

  let videoTrack = stream.getVideoTracks()[0]
  let videoContraints = videoTrack.getSettings()
  divConstraints.textContent = JSON.stringify(videoContraints, null, 2)

  window.stream = stream
  videoplay.srcObject = stream
  // audioplay.srcObject = stream
  return navigator.mediaDevices.enumerateDevices()
}

function handleError(err) {
  console.log('getUserMedia error:', err)
}

function start () {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia is not supported')
  } else {
    var deviceId = videoSource.value
    var constrants = {
      // video: false,
      video: {
        width: {
          min: 300,
          min: 640
        },
        height: {
          min: 300,
          max: 480
        },
        frameRate: {
          min: 15,
          max: 30
        },
        facingMode: 'enviroment',
        deviceId: deviceId ? deviceId : undefined
      },
      // audio: false
      audio: {
        noiseSuppression: true,
        echoCancellation: true
      }
    }
    navigator.mediaDevices.getUserMedia(constrants)
      .then(gotMediaStream)
      .then(gotDevices)
      .catch(handleError)
  }
}

start()

videoSource.onchange = start

filtersSelect.onchange = function () {
  videoplay.className = filtersSelect.value
}

snapshot.onclick = function () {
  picture.className = filtersSelect.value
  picture.getContext('2d').drawImage(videoplay, 0, 0, picture.width, picture.height)
}

function hanldeDataAvailable(e) {
  if (e && e.data && e.data.size > 0) {
    buffer.push(e.data)
  }
}

function startRecord () {

  buffer = []

  var options = {
    mimeType: 'video/webm;codecs=vp8'
  }

  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not supported!`)
    return;
  }
  
  try {
    mediaRecorder = new MediaRecorder(window.stream, options)
  } catch (e) {
    console.error('Failed to create MediaRecorder:', e);
    return;
  }

  mediaRecorder.ondataavailable = hanldeDataAvailable
  mediaRecorder.start(10)
}

function stopRecord () {
  mediaRecorder.stop()
}

btnRecord.onclick = () => {
  if (btnRecord.textContent === 'Start Record') {
    startRecord()
    btnRecord.textContent = 'Stop Record'
    btnPlay.disabled = true
    btnDownload.disabled = true
  } else {
    stopRecord()
    btnRecord.textContent = 'Start Record'
    btnPlay.disabled = false
    btnDownload.disabled = false
  }
}

btnPlay.onclick = () => {
  let blob = new Blob(buffer, {type: 'video/webm'})
  recvideo.src = window.URL.createObjectURL(blob)
  recvideo.srcObject = null
  recvideo.controls = true
  recvideo.play()
}

btnDownload.onclick = () => {
  let blob = new Blob(buffer, {type: 'video/webm'})
  let url = window.URL.createObjectURL(blob)
  let a = document.createElement('a')

  a.href = url
  a.style.display = 'none'
  a.download = 'aaa.webm'
  a.click()
}
