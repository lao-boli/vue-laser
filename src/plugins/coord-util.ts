interface Coord {
  lat: number
  lng: number
}

// default lat and lng is ddmm
class CoordSet {
  lat
  lng
  ddmm = {
    lat: 0,
    lng: 0,
  }
  wgs = {
    lat: 0,
    lng: 0,
  }
  gsj = {
    lat: 0,
    lng: 0,
  }
  constructor(ddmm_latitude, ddmm_longitude) {
    this.lat = ddmm_latitude
    this.lng = ddmm_longitude
    this.ddmm.lat = ddmm_latitude
    this.ddmm.lng = ddmm_longitude
    this.wgs.lat = this.dmToDd(ddmm_latitude)
    this.wgs.lng = this.dmToDd(ddmm_longitude)
    const converted_coord = this.transformFromWGSToGCJ(
      this.wgs.lng,
      this.wgs.lat
    )
    this.gsj.lat = converted_coord.lat
    this.gsj.lng = converted_coord.lng
  }

  /**
   * GPS coord dd.mmmmmm to dd.dddddd
   *
   * it's dd.mmmmmm not ddmm.mmmm
   * @param {number} dm
   * @returns {number}
   *  */
  dmToDd(dm: number) {
    const d = Math.floor(dm)
    const m = dm - d
    const decimal_d = (m / 60) * 100
    const dd = d + decimal_d
    return dd
  }

  /**
   * Code from
   * https://github.com/hiwanz/wgs2mars.js/blob/master/lib/wgs2mars.js
   * @param {number} wgLon
   * @param {number} wgLat
   * @returns {Coord} Object
   */
  transformFromWGSToGCJ(wgLon: number, wgLat: number) {
    // We are always in the Fucking China
    // const PI
    const PI = 3.14159265358979324
    // Krasovsky 1940
    // a = 6378245.0, 1/f = 298.3
    // b = a * (1 - f)
    // ee = (a^2 - b^2) / a^2
    const a = 6378245.0
    const ee = 0.00669342162296594323
    function transformLat(x, y) {
      let ret =
        -100.0 +
        2.0 * x +
        3.0 * y +
        0.2 * y * y +
        0.1 * x * y +
        0.2 * Math.sqrt(Math.abs(x))
      ret +=
        ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) *
          2.0) /
        3.0
      ret +=
        ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) /
        3.0
      ret +=
        ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) *
          2.0) /
        3.0
      return ret
    }
    function transformLon(x, y) {
      let ret =
        300.0 +
        x +
        2.0 * y +
        0.1 * x * x +
        0.1 * x * y +
        0.1 * Math.sqrt(Math.abs(x))
      ret +=
        ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) *
          2.0) /
        3.0
      ret +=
        ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) /
        3.0
      ret +=
        ((150.0 * Math.sin((x / 12.0) * PI) +
          300.0 * Math.sin((x / 30.0) * PI)) *
          2.0) /
        3.0
      return ret
    }
    // World Geodetic System ==> Mars Geodetic System
    function transform(wgLon, wgLat) {
      let mgLoc: Coord = {
        lat: 0,
        lng: 0,
      }
      // if (!isInChina([wgLon, wgLat], chinaBorderData)) {
      //   mgLoc = {
      //     lat: wgLat,
      //     lng: wgLon
      //   }
      //   return mgLoc
      // }
      let dLat = transformLat(wgLon - 105.0, wgLat - 35.0)
      let dLon = transformLon(wgLon - 105.0, wgLat - 35.0)
      let radLat = (wgLat / 180.0) * PI
      let magic = Math.sin(radLat)
      magic = 1 - ee * magic * magic
      let sqrtMagic = Math.sqrt(magic)
      dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI)
      dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI)
      mgLoc = {
        lat: wgLat + dLat,
        lng: wgLon + dLon,
      }
      return mgLoc
    }
    return transform(wgLon, wgLat)
  }
}

export {CoordSet,Coord}