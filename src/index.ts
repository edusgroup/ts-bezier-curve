// P = (1-t)³P1 + 3(1-t)²tP2 +3(1-t)²tP3 + t³P4

type TPoint = {
  x: number
  y: number
}

type TBezierCurveCubic = {
  p1: TPoint
  p2: TPoint
  p3: TPoint
  p4: TPoint
}

type TPointsValue = {
  p1: number
  p2: number
  p3: number
  p4: number
}

function getBezierCurveCubicPos (t: number, curve: TPointsValue) {
  return Math.pow(1 - t, 3) * curve.p1
    + 3 * Math.pow(1 - t, 2) * t * curve.p2
    + 3 * Math.pow((1 - t), 2) * t * curve.p3
    + Math.pow(t, 3) * curve.p4
}

// https://cubic-bezier.com/#.81,.11,.09,.83
const curve1: TBezierCurveCubic = {
  p1: { x: 0, y: 0 },
  p2: { x: 0.81, y: 0.11 },
  p3: { x: 0.09, y: 0.83 },
  p4: { x: 1, y: 1 }
}

// https://cubic-bezier.com/#.19,.56,.09,.83
const curve2: TBezierCurveCubic = {
  p1: { x: 0, y: 0 },
  p2: { x: 0.19, y: 0.59 },
  p3: { x: 0.09, y: 0.83 },
  p4: { x: 1, y: 1 }
}
// https://cubic-bezier.com/#.02,1.03,.17,.41
const curve = {
  p1: { x: 0, y: 0 },
  p2: { x: 0.02, y: 1.03 },
  p3: { x: 0.17, y: 0.41 },
  p4: { x: 1, y: 1 }
}

for (let i = 0; i <= 1; i += 0.1) {
  // const pointsX = { p1: curve.p1.x, p2: curve.p2.x, p3: curve.p3.x, p4: curve.p4.x }
  // const x = round2(getBezierCurveCubicPos(i, pointsX))
  const pointsY = { p1: curve.p1.y, p2: curve.p2.y, p3: curve.p3.y, p4: curve.p4.y }
  const y = round2(getBezierCurveCubicPos(i, pointsY))
  console.log(round2(i), y)
}

function round2 (num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

function cubicQxy (t: number, curve: TBezierCurveCubic) {
  let ax = curve.p1.x
  ax += (curve.p2.x - curve.p1.x) * t
  let bx = curve.p2.x
  bx += (curve.p3.x - curve.p2.x) * t
  let cx = curve.p3.x
  cx += (curve.p4.x - curve.p3.x) * t

  ax += (bx - ax) * t
  bx += (cx - bx) * t

  let ay = curve.p1.y
  ay += (curve.p2.y - curve.p1.y) * t
  let by = curve.p2.y
  by += (curve.p3.y - curve.p2.y) * t
  let cy = curve.p3.y
  cy += (curve.p4.y - curve.p3.y) * t

  ay += (by - ay) * t
  by += (cy - by) * t

  return ({
    x: ax + (bx - ax) * t,
    y: ay + (by - ay) * t
  })
}

function getCubicBezierLength (curve: TBezierCurveCubic, sampleCount: number = 40) {
  let totDist = 0
  let lastX = curve.p1.x
  let lastY = curve.p1.y
  let dx, dy
  for (let i = 1; i < sampleCount; i++) {
    let pt = cubicQxy(i / sampleCount, curve)
    dx = pt.x - lastX
    dy = pt.y - lastY
    totDist += Math.sqrt(dx * dx + dy * dy)
    lastX = pt.x
    lastY = pt.y
  }
  dx = curve.p4.x - lastX
  dy = curve.p4.y - lastY
  totDist += Math.sqrt(dx * dx + dy * dy)
  return totDist
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

const bezierPoint:TBezierCurveCubic = {
  p1: { x: 0, y: 0 },
  p2: { x: 100, y: 100 },
  p3: { x: 200, y: 200 },
  p4: { x: 500, y: 500 }
}
ctx.moveTo(bezierPoint.p1.x, bezierPoint.p1.y)
ctx.bezierCurveTo(
  bezierPoint.p2.x,
  bezierPoint.p2.y,
  bezierPoint.p3.x,
  bezierPoint.p3.y,
  bezierPoint.p4.x,
  bezierPoint.p4.y
)
ctx.stroke()

// ctx.rect(0, 0, 200, 200)
// ctx.fill()

console.log(getCubicBezierLength(bezierPoint, 40))

