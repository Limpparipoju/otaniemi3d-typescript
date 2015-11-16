interface FloorPlan {
  url: string,
  name: string,
  floor: number,
  svg?: Element,
  sensorData?: OdfObject[],
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

interface OdfObject {
  id: string,
  type?: string,
  description?: string,
  infoItems: InfoItem[],
  childObjects: OdfObject[]
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

interface OdfTreeNode {
  id?: string,
  text: string,
  children: Array<string|OdfTreeNode>|boolean,
  object?: OdfObject|InfoItem,
  orginal?: any,
  icon?: string,
  state?: {
    opened: boolean,
    disabled: boolean,
    selected: boolean
  },
  li_attr?: any,
  a_attr?: any
}
