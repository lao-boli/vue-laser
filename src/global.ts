/**
*
!!!!important!!!!
rename src/globle.js.default to src/globle.js to run!
*/

// I know I should use .env to Manage Environment Variable.
// But I'm just lazy
// I know node js has it's own env

const remoteURL = "nyan.one"
const localURL = document.location.hostname
// It's a fucking CONST
const baseURL = document.location.hostname
// let baseURL = "127.0.0.1"
// for debug
const basePort = 8010
const wsPath = "shootwebsocket"
const fullBaseURL = `http://${baseURL}:${basePort}/`

const audioServerURL = `http://192.168.2.135:5000`

const audioSaveURL = `${audioServerURL}/save`
const audioURL = `${audioServerURL}/audio`
const dynamicAudioURL = `${audioURL}/dynamics`
const numberAudioURL = `${audioURL}/number`
const regularAudioURL = `${audioURL}/regular`

const latlngAudioURL = `${audioURL}/latlng`

const audioPath = `/home/pi/audio`
const dynamicAudioPath = `${audioPath}/dynamics`
const numberAudioPath = `${audioPath}/number`
const regularAudioPath = `${audioPath}/regular`
const latlngAudioPath = `${audioPath}/latlng`
const isGCJ = true

export {
  basePort, baseURL,audioServerURL,audioSaveURL,
  audioURL,numberAudioURL,dynamicAudioURL,regularAudioURL,latlngAudioURL,
  audioPath,numberAudioPath,dynamicAudioPath,regularAudioPath,latlngAudioPath,
  wsPath, fullBaseURL, isGCJ,
}
