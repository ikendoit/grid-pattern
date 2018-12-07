#!/usr/bin/env node
const {
  calculateAngle,
  calculateLength
} = require('./utils/index')

const {
  lengthPointToLine,
  // special two fuction, which takes array of [lng, lat] instead of point format
  getMirrorPointOnLine,
  calcLength,
} = require('./utils/geometry')

const {
  POINT_00,
  POINT_0_m1
} = require('./utils/constants')

const mockData = require('./mock')

/*
  return an object of fundamental information of a grid pattern
  or null if not a grid
  null | {
    lng: float - lng spacing between cells 
    lat: float - lat spacing between cells
    alpha: float - angle of vector(AC) with vector(0,-1), should be 0 if the grid is not rotated
  }
*/
const extractBasicGrid = (pA, pB, pC) => {
  const squareTop = calculateAngle(pA, pB, pA, pC) === 90
  if( !squareTop ) {
    console.log('invalid top lefts points')
    return null
  }

  const angleAC = calculateAngle(pA, pC, POINT_00, POINT_0_m1)
  // by convention, angle(AB, (1,0)) === angle (AC, (0,-1)) if angle(BAC) === 90 rad

  // calculate distance AB (lng) and AC (lat)
  const lng = calculateLength(pA,pB)
  const lat = calculateLength(pA,pC)

  return {
    lng,
    lat,
    alpha: angleAC
  }

}


/*
  a grid may look like this, with the top left set of points in the A,B,C order in the pattern object
  ```
    A  B  X  X  X  X  X

    C  X  X  X  X  X  X
    
    X  X  X  X  X  X  X
  ```

  fundamental types: 
    Point: {
      coordinates: [lng0, lat0]
      [key: string]: any
    }
    ViewPort: {
      NE: [lng, lat]   --->North East of the view port 
      SW: [lng, lat]   --->South West of the view port
    }

  @param: gridPattern: object of grid pattern
    { 
      topLefts: {
        A: Point
        B: Point
        C: Point
      }
      mutation: {
        rotate: <number>
        extend: <ViewPort>
        spacing: {
          lat: <number> 
          lng: <number>
        }
      }
    }

  @param: data: array of point arrays
    [Point, Point, Point,...]

  @return: 
    - With No "mutation" flag passed: 
      + Array of points within grid: 
      ```
        { data: [
          [
            Point, 
            Point,
            Point,
            ...
          ]
        }
      ```
    - With "mutation" flag passed
      + Array of points within grid + 
      + new Pattern Object (a new topLefts set of points)
*/
const getPointInGrid = ({pattern, data}) => {

  const {A,B,C} = pattern.topLefts 

  const {
    lng,
    lat,
    alpha
  } = extractBasicGrid(A,B,C)

  // assume: filtering points in grid pattern
  const filteredPointsInGrid = data.filter(point => {
    try {
      const coord = point.coordinates
      // length E to AB % lng == 0 && length E -> AC % lat = 0 => true
      const lengthLng = lengthPointToLine(A,C,point)
      const lengthLat = lengthPointToLine(A,B,point)
      if (
        lengthLng % lng === 0 && 
        lengthLat % lat === 0 ) {
          return true       
        }
      return false
    } catch(err){
      console.log(err)
    }
  })

  return filteredPointsInGrid
}

/*
  take in 
    grid pattern, 
    data grid, 
    grid-lng spacing
    grid-lat spacing
    grid-rotation
    latSpacing and/or lngSpacing
*/
const changeSpacingOfGrid = ({
  pattern, 
  data,
  latSpacing, 
  lngSpacing
}) => {
  /*
    get the minimum lat/lng from the A,B,C in pattern
    for each point in data: 
      calculate mirror point to AB and AC 
      for AB: 
        vector(mirrorPoint, newPoint) / vector(mirrorPoint, oldPoint) = lat/oldLat
  */
   
  const {A,B,C} = pattern.topLefts
  
  const {
    lng, 
    lat, 
    alpha,
  } = extractBasicGrid(A,B,C)

  for (let point of data) {
    try {

      console.log('-----------------------------------')
      console.log('old point: ',point.coordinates)
      if (lngSpacing) {
        // change lng spacing first
        let pointArray = point.coordinates
        const mirrorPointToAC_Array = getMirrorPointOnLine(A.coordinates, C.coordinates, pointArray)
        const lngNewPointLngChanged = (lngSpacing/lng)*(pointArray[0] - mirrorPointToAC_Array[0]) + mirrorPointToAC_Array[0]
        const latNewPointLngChanged = (lngSpacing/lng)*(pointArray[1] - mirrorPointToAC_Array[1]) + mirrorPointToAC_Array[1]
        point.coordinates = [lngNewPointLngChanged, latNewPointLngChanged]
      }

      if (latSpacing) {
        // change lat spacing second
        pointArray = point.coordinates
        const mirrorPointToAB_Array = getMirrorPointOnLine(A.coordinates, B.coordinates, point.coordinates)
        const lngNewPointLatChanged = (latSpacing/lat)*(pointArray[0] - mirrorPointToAB_Array[0]) + mirrorPointToAB_Array[0]
        const latNewPointLatChanged = (latSpacing/lat)*(pointArray[1] - mirrorPointToAB_Array[1]) + mirrorPointToAB_Array[1]
        point.coordinates = [lngNewPointLatChanged, latNewPointLatChanged]

        console.log('new point: ',point.coordinates)
      }

    } catch(err) {
      console.log('Error changing spacing of point: ', err)
    }
  }

  return data


}

const spacingChanged = changeSpacingOfGrid({
  pattern: {
    topLefts: mockData.topLefts
  },
  data: mockData.data,
  lngSpacing: 200,
  latSpacing: 200,
})

//const result = getPointInGrid({
//  data: {
//    topLefts: mockData.topLefts
//  },
//  mockData.data)
//
//console.log(result)
