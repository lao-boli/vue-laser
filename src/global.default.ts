/**
*
!!!!important!!!!
rename this file to global.ts
*/

// I know I should use .env to Manage Environment Variable.
// But I'm just lazy
// I know node js has it's own env

const remoteURL = "nyan.one"
const localURL = document.location.hostname
// It's a fucking CONST
const baseURL = document.location.hostname
// for debug
const basePort = 9528
const wsPath = "shootwebsocket"
const fullBaseURL = `http://${baseURL}:${basePort}/`
const isGCJ = true

export {
  basePort, baseURL, wsPath, fullBaseURL, isGCJ,
}
