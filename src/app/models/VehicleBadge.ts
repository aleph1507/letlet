import { resourceVehicle } from "./resourceVehicle";

export class VehicleBadge {
  id: number;
  permitNumber: number;
  return: boolean;
  vehicle: resourceVehicle;
  expireDate: string;
  shreddigDate: string;
}
