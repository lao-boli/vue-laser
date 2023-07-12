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