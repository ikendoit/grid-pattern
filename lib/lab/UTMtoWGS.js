#!/usr/bin/env node
const datas = require('./datas-utm')
const proj = require('proj4')

const generateUtmStr = (zone2Digit) => `+proj=utm +zone=${zone2Digit} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`

/**
  convert an array of UTM Zone projection to the respective SRID:4326, which is like a 2D map
  @param: pointsArr: [number, number][] => [lng, lat][][]
*/
const translateWGS = (pointsArr) => {
  // for california, the typical utm zone is 326XX, we grab that last XX and pass here

  const [lng, lat] = pointsArr[0]
  //const utmZone = Math.floor((lng+180)/6)+1
  const utmZone = 11
  const newPointArr = pointsArr.map(point => proj(generateUtmStr(utmZone), 'EPSG:4326' , point)).map(point => [point[0].toFixed(7), point[1].toFixed(7)])

  console.log(newPointArr)
}

translateWGS(datas.map(point => point.coordinates))
