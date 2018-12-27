#!/usr/bin/env node
const {
  calculateAngle,
  calculateLength
} = require('../utils/index')

const {
  lengthPointToLine
} = require('../utils/geometry')

const data = [ 
  {
    id: 'randid1',
    name: 'randname',
    coordinates: [ 306863.0000000, 3938878.0000000 ]
  },
  {
    id: 'randid11',
    name: 'randname',
    coordinates: [ 306863.0000000, 3939037.0000000 ]
  },
  {
    id: 'randid111',
    name: 'randname',
    coordinates: [ 307022.0000000, 3938878.0000000 ]
  },
  {
    id: 'randid111',
    name: 'randname',
    coordinates: [ 307022.0000000, 3939037.0000000 ]
  },
  {
    id: 'randid1111',
    name: 'randname',
    coordinates: [ 307181.0000000, 3938878.0000000 ]
  },
  {
    id: 'randid11111',
    name: 'randname',
    coordinates: [ 307181.0000000, 3939037.0000000 ]
  },
  {
    id: 'randid2',
    name: 'randname',
    coordinates: [ 307340.0000000, 3938878.0000000 ]
  },
  {
    id: 'randid22',
    name: 'randname',
    coordinates: [ 307340.0000000, 3939037.0000000 ]
  },
  {
    id: 'randid2222',
    name: 'randname',
    coordinates: [ 307499.0000000, 3938878.0000000 ]
  },
  {
    id: 'randid2222',
    name: 'randname',
    coordinates: [ 307499.0000000, 3939037.0000000 ]
  },
  {
    id: 'randid22222',
    name: 'randname',
    coordinates: [ 307658.0000000, 3938878.0000000 ]
  },
  {
    id: 'randid3',
    name: 'randname',
    coordinates: [ 307658.0000000, 3939037.0000000 ]
  },
  {
    id: 'randid33',
    name: 'randname',
    coordinates: [ 307817.0000000, 3938878.0000000 ]
  },
  {
    id: 'randid333',
    name: 'randname',
    coordinates: [ 307817.0000000, 3939037.0000000 ]
  },
  {
    id: 'randid3333',
    name: 'randname',
    coordinates: [ 307976.0000000, 3938878.0000000 ]
  },
  {
    id: 'randid33333',
    name: 'randname',
    coordinates: [ 307976.0000000, 3939037.0000000 ]
  },
  {
    id: 'randid6',
    name: 'randname',
    coordinates: [ 308135.0000000, 3938878.0000000 ]
  },
  {
    id: 'randid66',
    name: 'randname',
    coordinates: [ 308135.0000000, 3939037.0000000 ]
  },
  {
    id: 'randid666',
    name: 'randname',
    coordinates: [ 308294.0000000, 3938878.0000000 ]
  },
  {
    id: 'randid6666',
    name: 'randname',
    coordinates: [ 308294.0000000, 3939037.0000000 ]
  },
  {
    id: 'trash point 1',
    name: 'trash point 1',
    coordinates: [ 311294.0000000, 31229037.0000000 ]
  },
  {
    id: 'trash point 11',
    name: 'trash point 11',
    coordinates: [ 211294.0000000, 21229037.0000000 ]
  },
  {
    id: 'trash point 111',
    name: 'trash point 111',
    coordinates: [ 1294.0000000, 21937.0000000 ]
  },
  {
    id: 'trash point 22',
    name: 'trash point 22',
    coordinates: [ 12932294.0000000, 299991937.0000000 ]
  },
  {
    id: 'trash point 222',
    name: 'trash point 222',
    coordinates: [ 932294.0000000, 9991937.0000000 ]
  },
  {
    id: 'trash point 2222',
    name: 'trash point 2222',
    coordinates: [ 82932294.0000000, 991937.0000000 ]
  },
]

/*
  grab the A,B and C
  A  B  X  X  X  X  X

  C  X  X  X  X  X  X
  
  X  X  X  X  X  X  X
*/
const TOPLEFTS = {
  'A': { coordinates: [ 306863, 3939037 ] },
  'B': { coordinates: [ 307022, 3939037 ] },
  'C': { coordinates: [ 306863, 3938878 ] },
}

const POINT_00 = {
  id: 'root point 0,0',
  coordinates: [0,0]
}

const POINT_0_m1 = {
  id: 'root point 0,-1',
  coordinates: [0,-1]
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

getPointInGrid({
  topLefts: TOPLEFTS
}, data)
