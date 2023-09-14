export const hitMap = {
  "红队": require('@/assets/audio/common/hongduide.wav'),
  "蓝队": require('@/assets/audio/common/landuide.wav'),
}
export const hitPartMap = {
  "头部": require('@/assets/audio/common/toubu.wav'),
  "腹部": require('@/assets/audio/common/fubu.wav'),
  "左手": require('@/assets/audio/common/zuoshou.wav'),
  "右手": require('@/assets/audio/common/youshou.wav'),
  "左脚": require('@/assets/audio/common/zuojiao.wav'),
  "右脚": require('@/assets/audio/common/youjiao.wav'),
  "前甲": require('@/assets/audio/common/qianjia.wav'),
  "背甲": require('@/assets/audio/common/beijia.wav'),
}
export function getHitMap(){
  return hitMap
}
function mergeWavFiles(wavFiles) {
  const audioContext = new AudioContext()

  return Promise.all(wavFiles.map(file => fetch(file).then(response => response.arrayBuffer())))
    .then(arrayBuffers => {
      const audioBuffers = []

      arrayBuffers.forEach(buffer => {
        audioBuffers.push(audioContext.decodeAudioData(buffer))
      })

      return Promise.all(audioBuffers)
    })
    .then(buffers => {
      // 计算合并后的总时长和声道数
      const totalDuration = buffers.reduce((duration, buffer) => duration + buffer.duration, 0)
      const numberOfChannels = buffers[0].numberOfChannels

      // 创建新的音频缓冲区
      const mergedBuffer = audioContext.createBuffer(numberOfChannels, totalDuration * audioContext.sampleRate, audioContext.sampleRate)

      // 将每个 WAV 文件的数据写入合并后的缓冲区
      let offset = 0
      buffers.forEach(buffer => {
        for (let channel = 0; channel < numberOfChannels; channel++) {
          const inputData = buffer.getChannelData(channel)
          const outputData = mergedBuffer.getChannelData(channel)

          for (let i = 0; i < inputData.length; i++) {
            outputData[offset + i] = inputData[i]
          }
        }

        offset += buffer.length
      })

      return mergedBuffer
    })
}
export function synthesizeAndPlay(wavFiles){
  mergeWavFiles(wavFiles)
    .then(mergedBuffer => {
      const audioContext = new AudioContext()
      const audioSource = audioContext.createBufferSource()
      audioSource.buffer = mergedBuffer
      audioSource.connect(audioContext.destination)
      audioSource.start()
    })
    .catch(error => {
      console.error('合并和播放音频文件时出错：', error)
    })
}
