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
const isGCJ = true

export {
  basePort, baseURL, wsPath, fullBaseURL, isGCJ,
}
