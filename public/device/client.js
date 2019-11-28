'use strict'

var audioSource = document.querySelector('select#audioSource');
var audioOutput = document.querySelector('select#audioOutput');
var videoSource = document.querySelector('select#videoSource');


if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  console.log('enumerateDevices is not supported!')
} else {
  var constrants = {
    video: true,
    audio: true
  }
  navigator.mediaDevices.getUserMedia(constrants)
    .then(getDevice)
    .catch(handleError)
}

function getDevice() {
  navigator.mediaDevices.enumerateDevices()
    .then(getDevices)
    .catch(handleError)
}

function getDevices (deviceInfos) {
  deviceInfos.forEach(function (deviceInfo) {
    console.log(deviceInfo)
    console.log(deviceInfo.kind + ": label = " + deviceInfo.label + ": id = " + deviceInfo.deviceId + ": groupId = " + deviceInfo.groupId)
    let option = document.createElement('option');
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


function handleError (err) {
  console.log(err.name + " : " + err.message)
}
