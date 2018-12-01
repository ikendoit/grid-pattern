#!/usr/bin/env node
const {
  calculateAngle,
  calculateLength
} = require('./utils/index')

const {
  lengthPointToLine
} = require('./utils/geometry')

const {
  POINT_00,
  POINT_0_m1
} = require('./utils/constants')

const mockData = require('./mock')


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
const getPointInGrid = (pattern, data) => {
  const {A,B,C} = pattern.topLefts 

  // validate valid top lefts 
  const angleTopLeft = calculateAngle(A, B, A, C)
  if (angleTopLeft !== 90) {
    console.log('invalid pattern top left, not 90 radian', A,B,C)
    return null
  }

  // calculate: angle of the topLefts to (0,-1) 
  const angleAB = calculateAngle(A, B, POINT_00, POINT_0_m1)
  const angleAC = calculateAngle(A, C, POINT_00, POINT_0_m1)

  // calculate distance AB (lng) and AC (lat)
  const lng = calculateLength(A,B)
  const lat = calculateLength(A,C)

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
const changeSpacingOfGrid = ({{
  pattern, 
  defaultLng,
  defaultLat,
  data,
  latSpacing, 
  lngSpacing
}) => {
  // change lat of grid: 
  // get old Ox, Oy

  // get new Ox, Oy
  const newOx = Math.sin(pattern.rotation) * latSpacing
  const newOy = Math.sin(pattern.rotation) * latSpacing

  const newDiag = Math.sqrt(newOx**2 + newOy**2)
  
  // change lng of grid: 
  //const Ox = Math.sin(alpha) * lngSpacing
  //const Oy = Math.sin(alpha) * lngSpacing
}

const result = getPointInGrid({
  topLefts: mockData.topLefts
}, mockData.data)

console.log(result)
