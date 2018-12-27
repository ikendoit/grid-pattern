#!/usr/bin/env node
const datas = require('./datas')
const proj = require('proj4')

const generateUtmStr = (zone2Digit) => `+proj=utm +zone=${zone2Digit} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`

/**
  convert an array of SRID:4326 to the respective UTM Zone projection, which is like a 2D map
  @param: pointsArr: [number, number][] => [lng, lat][][]
*/
const translateUTM = (pointsArr) => {
  // for california, the typical utm zone is 326XX, we grab that last XX and pass here

  const [lng, lat] = pointsArr[0]
  const utmZone = Math.floor((lng+180)/6)+1
  console.log(generateUtmStr(utmZone))
  const newPointArr = pointsArr.map(point => proj('EPSG:4326', generateUtmStr(utmZone), point)).map(point => [point[0].toFixed(7), point[1].toFixed(7)])

  console.log(newPointArr)
}

translateUTM(datas)
