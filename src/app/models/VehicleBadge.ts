import { resourceVehicle } from "./resourceVehicle";

export interface VehicleBadge {
  id: number,
  permitNumber: number,
  return: boolean,
  vehicle: resourceVehicle,
  expireDate: string,
  shreddigDate: string,
}
