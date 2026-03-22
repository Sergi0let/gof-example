// types
type CoordinatesType = {
  lat: number;
  lng: number;
};

type PointOfInterestType = {
  name: string;
  lat: number;
  lng: number;
  type: "landmark" | "restaurant" | "viewpoint";
  rating?: number;
};

type RouteSegmentType = {
  start: CoordinatesType;
  end: CoordinatesType;
  distance: number;
  duration: number;
  instructions: string;
};

type TrafficInfoType = {
  level: "low" | "medium" | "high";
  delayMinutes: number;
};

type DetailedRouteResultType = {
  segment: RouteSegmentType[];
  pointsOfInterest: PointOfInterestType[];
  traffic?: TrafficInfoType;
  fuelConsumption?: number;
  carbonEmission?: number;
  estimatedCost?: number;
};
// type RouteResultType = {
//   distance: number; //km
//   duration: number; //min
//   routeType: string;
//   description: string;
// };

// Interface strategy
interface IRouteStrategy {
  getName(): string;
  calculateRoute(start: Coordinates, end: Coordinates): DetailedRouteResultType;
}
