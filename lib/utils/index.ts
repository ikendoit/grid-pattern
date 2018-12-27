import { PointObject } from '../typings'
// calculate angle of vector -(AB)-> and -(XY)->
/*
  @param: pA,pB,pX,pY : Point ( refer to typings.ts in the future, now just ctrl-F )
  formula:
    top: scala(cross product(AB and XY))
    bottom: scala(AB)*scala(XY)
  source: highschool geometry 
*/
const calculateAngle = (pA: PointObject,pB: PointObject,pX: PointObject,pY: PointObject) => {
  const A = pA.coordinates
  const B = pB.coordinates
  const X = pX.coordinates
  const Y = pY.coordinates

  const ABx     = (B[0]-A[0])    
  const ABy     = (B[1]-A[1])
  const XYx     = (X[0]-Y[0])
  const XYy     = (X[1]-Y[1])
  const scalaAB = Math.sqrt( ABx**2 + ABy**2 )
  const scalaXY = Math.sqrt( XYx**2 + XYy**2 )

  const TOP    = Math.abs(ABx*XYx + ABy*XYy)
  const BOTTOM = scalaAB * scalaXY

  const arccos_AB_XY = TOP/BOTTOM
  return Math.acos(arccos_AB_XY)*180/Math.PI
}

const calculateLength = (pA: PointObject,pB: PointObject) => {
  const A = pA.coordinates
  const B = pB.coordinates

  const ABx     = (B[0]-A[0])    
  const ABy     = (B[1]-A[1])
  const scalaAB = Math.sqrt( ABx**2 + ABy**2 )
  return scalaAB
}


export {
  calculateAngle,
  calculateLength
}

// not going to work if the grid is tilted
//const detectTopLeft = (data) => {
//  let maxY = 0
//  let minX = 99999999
//  for (let [x, y] of data) {
//    if (minX > x) minX=x
//    if (maxY < y) maxY=y
//  }
//  return {minX, maxY}
//}


