interface FloorPlan {
  url: string,
  name: string,
  floor: number,
  svg: Element,
  data: number[],
  translate: [number, number],
  scale: number
}

interface Room {
  id: string,
  name: string,
  floor: number
}

interface Building {
  id: string,
  name: string,
  lat: number,
  lng: number,
  coords: number[],
  floorPlans: FloorPlan[],
  rooms: Room[]
}
