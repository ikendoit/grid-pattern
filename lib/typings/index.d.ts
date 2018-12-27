export interface PointGeoJSON {
  type: 'Point',
  coordinates: [number, number]
}

export interface PointObject {
  location: PointGeoJSON
  [key: string]: any
}

export interface PatternObject {
  topLefts: {
    A: PointObject, 
    B: PointObject, 
    C: PointObject
  }
}

export interface ViewPort {
  SW: [number, number] // [lng, lat]
  NE: [number, number] // [lng, lat]
}

export interface MutationObject {
  rotate: number
  extend: ViewPort
  spacing: {
    lat: number
    lng: number
  }
}