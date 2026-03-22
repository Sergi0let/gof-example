// Types

type Coordinates = {
  lat: number;
  lng: number;
};

type RouteResult = {
  distance: number; //km
  duration: number; //min
  routeType: string;
  description: string;
};

// Interface strategy
interface IRouteStrategy {
  getName(): string;
  calculateRoute(start: Coordinates, end: Coordinates): RouteResult;
}

function calculateDistance(start: Coordinates, end: Coordinates): number {
  const R = 6371; // Радіус Землі в км

  const lat1 = (start.lat * Math.PI) / 180;
  const lat2 = (end.lat * Math.PI) / 180;
  const deltaLat = ((end.lat - start.lat) * Math.PI) / 180;
  const deltaLng = ((end.lng - start.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c * 10) / 10;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return hours > 0 ? `${hours} год ${mins} хв` : `${mins} хв`;
}

// Найшвидший маршрут (через траси, 100 км/год)
class FastestRoute implements IRouteStrategy {
  getName(): string {
    return "Fastest Route";
  }
  calculateRoute(start: Coordinates, end: Coordinates): RouteResult {
    const distance = calculateDistance(start, end);

    const duration = (distance / 100) * 60;

    return {
      distance,
      duration,
      routeType: this.getName(),
      description: `Швидкісні траси`,
    };
  }
}

// Найкоротший маршрут (через містечка, 70 км/год)
class ShortestRoute implements IRouteStrategy {
  getName(): string {
    return "Shortest Route";
  }
  calculateRoute(start: Coordinates, end: Coordinates): RouteResult {
    const distance = calculateDistance(start, end);
    const duration = Math.round((distance / 70) * 60 * 100) / 100;

    return {
      distance,
      duration,
      routeType: this.getName(),
      description: "Рух через містечка",
    };
  }
}

// Мальовничий маршрут (довший, повільніший, але цікавий)
class ScenicRoute implements IRouteStrategy {
  getName(): string {
    return "Scenic Route";
  }

  calculateRoute(start: Coordinates, end: Coordinates): RouteResult {
    const ADD_DISTANCE = 1.3;
    const distance = calculateDistance(start, end) * ADD_DISTANCE;
    const duration = Math.round((distance / 70) * 60 * 100) / 100;

    return {
      distance,
      duration,
      routeType: this.getName(),
      description: "Мальовничий маршрут",
    };
  }
}

class RouteNavigator {
  private currentStrategy: IRouteStrategy;
  constructor(strategy?: IRouteStrategy) {
    this.currentStrategy = strategy || new FastestRoute();
  }

  setStrategy(strategy: IRouteStrategy): void {
    this.currentStrategy = strategy;
  }

  calculateRoute(start: Coordinates, end: Coordinates): RouteResult {
    return this.currentStrategy.calculateRoute(start, end);
  }

  displayRoute(start: Coordinates, end: Coordinates): void {
    const result = this.calculateRoute(start, end);

    console.log("\n" + "=".repeat(60));
    console.log(`🗺️  ${result.routeType.toUpperCase()}`);
    console.log("=".repeat(60));
    console.log(`📍 Старт: ${start.lat}, ${start.lng}`);
    console.log(`🎯 Фініш: ${end.lat}, ${end.lng}`);
    console.log(`📏 Відстань: ${result.distance} км`);
    console.log(`⏱️  Час: ${formatDuration(result.duration)}`);
    console.log(`💡 ${result.description}`);
    console.log("=".repeat(60) + "\n");
  }
}

console.log("🎯 ROUTE PLANNER - SIMPLE\n");

const navigatorOne = new RouteNavigator();
const kyiv = { lat: 50.4501, lng: 30.5234 };
const lviv = { lat: 49.8397, lng: 24.0297 };

// Тест 1
navigatorOne.setStrategy(new FastestRoute());
navigatorOne.displayRoute(kyiv, lviv);

// Тест 2
navigatorOne.setStrategy(new ShortestRoute());
navigatorOne.displayRoute(kyiv, lviv);

// Тест 3
navigatorOne.setStrategy(new ScenicRoute());
navigatorOne.displayRoute(kyiv, lviv);

// ----------------------------------
function compareRoutes(start: Coordinates, end: Coordinates): void {
  console.log("=".repeat(60));
  console.log("📊 ПОРІВНЯННЯ МАРШРУТІВ");
  console.log("=".repeat(60));

  const strategies = [new FastestRoute(), new ShortestRoute(), new ScenicRoute()];

  strategies.forEach((strategy) => {
    const nav = new RouteNavigator(strategy);
    const result = nav.calculateRoute(start, end);

    console.log(
      `${result.routeType.padEnd(20)} ${result.distance}km, ${formatDuration(result.duration)}`
    );
  });
  console.log("=".repeat(60));
}
compareRoutes(kyiv, lviv);
