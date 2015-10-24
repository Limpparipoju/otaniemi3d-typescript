interface FloorPlan {
  url: string,
  name: string,
  floor: number,
  svg?: Element,
  sensorData?: OmiObject[],
  translate?: [number, number],
  scale?: number,
  rooms: Room[]
}

interface InfoItem {
  name: string,
  metaData?: any,
  description?: string,
  values?: {value: number, time?: Date}[]
}

interface OmiObject {
  id: string,
  type?: string,
  description?: string,
  infoItems: InfoItem[],
  childObjects: OmiObject[]
}

interface Room {
  id: string,
  name: string
}

interface Building {
  id: string,
  name: string,
  lat: number,
  lng: number,
  coords: number[],
  floorPlans: FloorPlan[],
}

interface Sensor extends InfoItem {
  id: string,
  room: Room,
  suffix: string
}
