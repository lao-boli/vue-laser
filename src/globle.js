const baseURL=document.location.hostname
const basePort = 9528
const wsPath = "shootwebsocket"
const fullBaseURL= `http://${baseURL}:${basePort}/`
const isGCJ = true

export {basePort,baseURL,wsPath,fullBaseURL,isGCJ}