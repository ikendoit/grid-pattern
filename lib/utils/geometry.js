// points: [longitude,latitude] || geoJSON
const calcLength = (
  point1,
  point2
) => {
  let x1, x2, y1, y2;
  if (
    Array.isArray(point1) &&
    Array.isArray(point2) &&
    point1.length >= 2 &&
    point2.length >= 2
  ) {
    x1 = point1[0];
    x2 = point2[0];
    y1 = point1[1];
    y2 = point2[1];
  } else {
    console.log("invalid point coordinates");
    throw new Error("invalid point coordinates");
  }

  return parseFloat(Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2).toFixed(13));
};

// get mirror point of point Origin to line containing point1 and point2
const getMirrorPointOnLine = (
  point1,
  point2,
  pointOrigin
) => {
  const x1 = point1[0];
  const x2 = point2[0];
  const x3 = pointOrigin[0];
  const y1 = point1[1];
  const y2 = point2[1];
  const y3 = pointOrigin[1];
  // y = f(x) = a*x + b  (a = slope)
  let a = null;
  let mirrorPoint;
  let mirrorX;
  let mirrorY;

  if (y1 === y2) {
    mirrorX = x3;
    mirrorY = y2;
  } else if (x1 === x2) {
    mirrorX = x1;
    mirrorY = y3;
  } else {
    // compute slope of y=ax+b
    a = (y1 - y2) / (x1 - x2);
    // compute X coordinate of mirror point
    mirrorX = (a * y3 + x3 - a * y1 + x1 * a ** 2) * (1 / (1 + a ** 2));
    // compute Y coordinate of mirror point
    mirrorY = (a * y3 + x3 - mirrorX) / a;
  }

  mirrorPoint = [mirrorX, mirrorY];

  // check if mirror point is between point1 and 2 : AX + BX === AB

  //if (pointOnLine(point1, point2, mirrorPoint)) {
    return mirrorPoint;
  //} else {
  //  // if mirror point is not between point1 and point2 => return null
  //  return null;
  //}
};

const pointOnLine = (
  point1,
  point2,
  pointToCheck,
  toFixedConst = 13
) => {
  const point1_pointCheck_point2 =
    calcLength(point1, pointToCheck) + calcLength(pointToCheck, point2);

  const point1_point2 = calcLength(point1, point2);

  return (
    point1_pointCheck_point2.toFixed(toFixedConst) ===
    point1_point2.toFixed(toFixedConst)
  );
};

// calculate length from pointA to line containing pointB and pointC
// params are all points types
const lengthPointToLine = (pA, pB, pOrigin) => {
  const A = pA.coordinates
  const B = pB.coordinates
  const origin = pOrigin.coordinates

  // get mirror point: [number, number]
  const mirrorPoint = getMirrorPointOnLine(A,B,origin)
  if (!mirrorPoint) {
    throw new Error('cannot calculate length point to line: ',A,B,origin)
  }

  // get length mirror point to origin point
  const length = calcLength(mirrorPoint, origin)
  return length
}

module.exports =  {
  lengthPointToLine,
  getMirrorPointOnLine,
  calcLength,
};
