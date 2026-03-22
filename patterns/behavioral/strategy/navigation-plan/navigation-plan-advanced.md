# 🔴 СКЛАДНИЙ ВАРІАНТ

## ⏱️ Загальний час: 5-8 годин

---

## КРОК 1: РОЗШИРЕНІ ТИПИ (30 хв)

### Що робити:

Додай складніші типи для детальної інформації

### Код:

```typescript
type PointOfInterest = {
  name: string;
  lat: number;
  lng: number;
  type: "landmark" | "restaurant" | "viewpoint";
  rating?: number;
};

type RouteSegment = {
  start: Coordinates;
  end: Coordinates;
  distance: number;
  duration: number;
  instructions: string;
};

type TrafficInfo = {
  level: "low" | "medium" | "high";
  delayMinutes: number;
};

type DetailedRouteResult = RouteResult & {
  segments: RouteSegment[];
  pointsOfInterest?: PointOfInterest[];
  traffic?: TrafficInfo;
  fuelConsumption?: number;
  carbonEmission?: number;
  estimatedCost?: number;
};
```

---

## КРОК 2: МЕНЕДЖЕР СТРАТЕГІЙ (30 хв)

### Що робити:

Створи менеджер для управління стратегіями (як в Pricing System)

### Код:

```typescript
class RouteStrategyManager {
  private strategies = new Map<string, IRouteStrategy>();

  register(name: string, strategy: IRouteStrategy): this {
    if (this.strategies.has(name)) {
      console.warn(`Strategy "${name}" already exists`);
      return this;
    }
    this.strategies.set(name, strategy);
    return this;
  }

  get(name: string): IRouteStrategy | undefined {
    return this.strategies.get(name);
  }

  getAll(): IRouteStrategy[] {
    return Array.from(this.strategies.values());
  }

  getNames(): string[] {
    return Array.from(this.strategies.keys());
  }
}
```

---

## КРОК 3: ЕКОЛОГ

## КРОК 3: ЕКОЛОГІЧНИЙ МАРШРУТ (40 хв)

### Що робити:

Додай розрахунок палива та викидів CO2

### Код:

```typescript
class EcoRoute implements IRouteStrategy {
  getName(): string {
    return "Eco Route";
  }

  calculateRoute(start: Coordinates, end: Coordinates): DetailedRouteResult {
    const distance = calculateDistance(start, end);
    const duration = (distance / 60) * 60; // 60 км/год

    // Витрата палива (л/100км * відстань / 100)
    const fuelConsumption = (4.5 * distance) / 100;

    // Викиди CO2 (2.31 кг на 1 літр бензину)
    const carbonEmission = fuelConsumption * 2.31;

    return {
      distance,
      duration,
      routeType: this.getName(),
      description: "Економний маршрут",
      segments: [],
      fuelConsumption: Math.round(fuelConsumption * 10) / 10,
      carbonEmission: Math.round(carbonEmission * 10) / 10,
    };
  }
}
```

---

## КРОК 4: ГРОМАДСЬКИЙ ТРАНСПОРТ (30 хв)

### Що робити:

Маршрут автобусом/поїздом

### Код:

```typescript
class PublicTransportRoute implements IRouteStrategy {
  getName(): string {
    return "Public Transport";
  }

  calculateRoute(start: Coordinates, end: Coordinates): DetailedRouteResult {
    const distance = calculateDistance(start, end);
    const duration = (distance / 40) * 60 + 60; // +60 хв на пересадки

    return {
      distance,
      duration,
      routeType: this.getName(),
      description: "Автобус/поїзд",
      segments: [],
      estimatedCost: 300, // грн
      carbonEmission: (distance / 100) * 2, // 2 кг/100км
    };
  }
}
```

---

## КРОК 5: ТРАФІК (40 хв)

### Що робити:

Симулюй трафік залежно від години дня

### Код:

```typescript
class TrafficSimulator {
  static getTrafficInfo(hour: number = new Date().getHours()): TrafficInfo {
    // Ранковий пік 7-9
    if (hour >= 7 && hour <= 9) {
      return { level: "high", delayMinutes: 45 };
    }
    // Вечірній пік 17-19
    if (hour >= 17 && hour <= 19) {
      return { level: "high", delayMinutes: 60 };
    }
    // День
    if (hour >= 10 && hour <= 16) {
      return { level: "medium", delayMinutes: 15 };
    }
    // Ніч
    return { level: "low", delayMinutes: 0 };
  }
}

// Оновлена FastestRoute з трафіком
class FastestRouteWithTraffic implements IRouteStrategy {
  getName(): string {
    return "Fastest Route (with traffic)";
  }

  calculateRoute(start: Coordinates, end: Coordinates): DetailedRouteResult {
    const distance = calculateDistance(start, end);
    const baseDuration = (distance / 100) * 60;
    const traffic = TrafficSimulator.getTrafficInfo();
    const duration = baseDuration + traffic.delayMinutes;

    return {
      distance,
      duration,
      routeType: this.getName(),
      description: `Через траси (трафік: ${traffic.level})`,
      segments: [],
      traffic,
    };
  }
}
```

---

## КРОК 6: POINTS OF INTEREST (45 хв)

### Що робити:

Додай визначні місця на маршруті

### Код:

```typescript
class POIService {
  private static pois: PointOfInterest[] = [
    {
      name: "Софійський собор",
      lat: 50.4527,
      lng: 30.5146,
      type: "landmark",
      rating: 4.8,
    },
    {
      name: "Замок Високий",
      lat: 50.3744,
      lng: 28.7989,
      type: "landmark",
      rating: 4.5,
    },
    {
      name: "Тунель кохання",
      lat: 51.509,
      lng: 25.6977,
      type: "viewpoint",
      rating: 4.7,
    },
    {
      name: "Оперний театр",
      lat: 49.8426,
      lng: 24.0292,
      type: "landmark",
      rating: 4.9,
    },
  ];

  static findNearbyPOI(route: Coordinates[], maxDistanceKm: number = 20): PointOfInterest[] {
    const nearby: PointOfInterest[] = [];

    for (const poi of this.pois) {
      for (const point of route) {
        const distance = calculateDistance(point, poi);
        if (distance <= maxDistanceKm) {
          nearby.push(poi);
          break;
        }
      }
    }

    return nearby;
  }
}

// Оновлена ScenicRoute з POI
class ScenicRouteWithPOI implements IRouteStrategy {
  getName(): string {
    return "Scenic Route (with POI)";
  }

  calculateRoute(start: Coordinates, end: Coordinates): DetailedRouteResult {
    const baseDistance = calculateDistance(start, end);
    const distance = baseDistance * 1.3;
    const duration = (distance / 50) * 60;

    // Генеруємо точки маршруту
    const routePoints = this.generateRoutePoints(start, end);

    // Шукаємо POI поблизу
    const poi = POIService.findNearbyPOI(routePoints, 20);

    return {
      distance: Math.round(distance * 10) / 10,
      duration,
      routeType: this.getName(),
      description: `Через ${poi.length} цікавих місць`,
      segments: [],
      pointsOfInterest: poi,
    };
  }

  private generateRoutePoints(start: Coordinates, end: Coordinates): Coordinates[] {
    const points: Coordinates[] = [start];
    const steps = 10;

    for (let i = 1; i < steps; i++) {
      points.push({
        lat: start.lat + (end.lat - start.lat) * (i / steps),
        lng: start.lng + (end.lng - start.lng) * (i / steps),
      });
    }

    points.push(end);
    return points;
  }
}
```

---

## КРОК 7: РОЗШИРЕНИЙ НАВІГАТОР (30 хв)

### Що робити:

Оновлений навігатор з детальним виводом

### Код:

```typescript
class AdvancedRouteNavigator {
  private strategyManager: RouteStrategyManager;
  private currentStrategy?: IRouteStrategy;

  constructor() {
    this.strategyManager = new RouteStrategyManager();
  }

  registerStrategy(name: string, strategy: IRouteStrategy): this {
    this.strategyManager.register(name, strategy);
    return this;
  }

  setStrategy(name: string): void {
    const strategy = this.strategyManager.get(name);
    if (!strategy) {
      throw new Error(`Strategy "${name}" not found`);
    }
    this.currentStrategy = strategy;
  }

  calculateRoute(start: Coordinates, end: Coordinates): DetailedRouteResult {
    if (!this.currentStrategy) {
      throw new Error("No strategy selected");
    }
    return this.currentStrategy.calculateRoute(start, end) as DetailedRouteResult;
  }

  displayDetailedRoute(start: Coordinates, end: Coordinates): void {
    const result = this.calculateRoute(start, end);

    console.log("\n" + "=".repeat(70));
    console.log(`🗺️  ${result.routeType.toUpperCase()}`);
    console.log("=".repeat(70));
    console.log(`📍 Старт: Київ (${start.lat}, ${start.lng})`);
    console.log(`🎯 Фініш: Львів (${end.lat}, ${end.lng})`);
    console.log(`📏 Відстань: ${result.distance} км`);
    console.log(`⏱️  Час: ${formatDuration(result.duration)}`);

    if (result.fuelConsumption) {
      console.log(`⛽ Паливо: ${result.fuelConsumption} л`);
    }

    if (result.carbonEmission) {
      console.log(`🌱 CO2: ${result.carbonEmission} кг`);
    }

    if (result.estimatedCost) {
      console.log(`💰 Вартість: ${result.estimatedCost} грн`);
    }

    if (result.traffic) {
      console.log(`🚦 Трафік: ${result.traffic.level} (+${result.traffic.delayMinutes} хв)`);
    }

    if (result.pointsOfInterest && result.pointsOfInterest.length > 0) {
      console.log(`\n📸 Визначні місця на маршруті:`);
      result.pointsOfInterest.forEach((poi) => {
        const star = poi.rating ? `⭐ ${poi.rating}` : "";
        console.log(`   • ${poi.name} ${star}`);
      });
    }

    console.log(`\n💡 ${result.description}`);
    console.log("=".repeat(70) + "\n");
  }

  compareAllRoutes(start: Coordinates, end: Coordinates): void {
    console.log("\n" + "=".repeat(70));
    console.log("📊 ПОРІВНЯННЯ ВСІХ МАРШРУТІВ");
    console.log("=".repeat(70));

    const results: DetailedRouteResult[] = [];

    for (const strategy of this.strategyManager.getAll()) {
      this.currentStrategy = strategy;
      const result = this.calculateRoute(start, end);
      results.push(result);
    }

    // Сортуємо за часом
    results.sort((a, b) => a.duration - b.duration);

    results.forEach((result, index) => {
      const medal = index === 0 ? "🏆" : index === 1 ? "🥈" : "🥉";
      let extra = "";

      if (result.fuelConsumption) {
        extra += ` | ⛽${result.fuelConsumption}л`;
      }
      if (result.carbonEmission) {
        extra += ` | 🌱${result.carbonEmission}kg`;
      }
      if (result.estimatedCost) {
        extra += ` | 💰${result.estimatedCost}грн`;
      }

      console.log(
        `${medal} ${result.routeType.padEnd(30)} ${result.distance}км, ${formatDuration(result.duration)}${extra}`
      );
    });

    console.log("=".repeat(70) + "\n");
  }
}
```

---

## КРОК 8: ВСЕ РАЗОМ (30 хв)

### Що робити:

Зібрати всі стратегії та протестувати

### Код:

```typescript
console.log("🎯 ADVANCED ROUTE PLANNER\n");

const navigator = new AdvancedRouteNavigator();

// Реєструємо всі стратегії
navigator
  .registerStrategy("fastest", new FastestRoute())
  .registerStrategy("fastest-traffic", new FastestRouteWithTraffic())
  .registerStrategy("shortest", new ShortestRoute())
  .registerStrategy("scenic", new ScenicRouteWithPOI())
  .registerStrategy("eco", new EcoRoute())
  .registerStrategy("public", new PublicTransportRoute());

const kyiv = { lat: 50.4501, lng: 30.5234 };
const lviv = { lat: 49.8397, lng: 24.0297 };

// Тестуємо кожну стратегію
console.log("=== ТЕСТ ОКРЕМИХ СТРАТЕГІЙ ===\n");

navigator.setStrategy("fastest-traffic");
navigator.displayDetailedRoute(kyiv, lviv);

navigator.setStrategy("scenic");
navigator.displayDetailedRoute(kyiv, lviv);

navigator.setStrategy("eco");
navigator.displayDetailedRoute(kyiv, lviv);

navigator.setStrategy("public");
navigator.displayDetailedRoute(kyiv, lviv);

// Порівняння
navigator.compareAllRoutes(kyiv, lviv);
```

---

## ✅ ЧЕКЛИСТ СКЛАДНОГО ВАРІАНТУ

### Базові компоненти:

- [ ] Розширені типи (POI, Segments, Traffic)
- [ ] RouteStrategyManager
- [ ] AdvancedRouteNavigator

### Стратегії:

- [ ] FastestRoute (базова)
- [ ] FastestRouteWithTraffic (з трафіком)
- [ ] ShortestRoute
- [ ] ScenicRouteWithPOI (з визначними місцями)
- [ ] EcoRoute (з паливом та CO2)
- [ ] PublicTransportRoute (з вартістю)
- [ ] AvoidHighwaysRoute
- [ ] WalkingRoute (бонус)
- [ ] CyclingRoute (бонус)

### Додаткові сервіси:

- [ ] TrafficSimulator
- [ ] POIService
- [ ] compareAllRoutes

### Тести:

- [ ] Протестовано кожну стратегію
- [ ] Протестовано трафік
- [ ] Протестовано POI
- [ ] Протестовано порівняння

---

## 🎓 РІЗНИЦЯ МІЖ ПРОСТИМ ТА СКЛАДНИМ

| Аспект          | Простий           | Складний                   |
| --------------- | ----------------- | -------------------------- |
| **Типи**        | 2 базових         | 6+ розширених              |
| **Стратегії**   | 3 прості          | 6-9 детальних              |
| **Розрахунки**  | Відстань + час    | + паливо, CO2, вартість    |
| **Особливості** | Немає             | Трафік, POI, сегменти      |
| **Менеджер**    | Простий навігатор | Strategy Manager           |
| **Вивід**       | Базовий           | Детальний з emoji          |
| **Порівняння**  | Просте            | З сортуванням та фільтрами |
| **Час**         | 2-3 години        | 5-8 годин                  |

---

## 🚀 РОЗШИРЕННЯ (ЯКЩО ХОЧЕШ ЩЕ)

### 1. Реальний API

- Підключити Google Maps API
- Або OpenStreetMap API
- Отримувати реальні маршрути

### 2. Візуалізація

- HTML файл з картою
- Малювання маршруту на карті
- Інтерактивні POI

### 3. Збереження маршрутів

- Зберігати улюблені маршрути
- Історія пошуків
- Експорт в JSON

### 4. Waypoints

- Додавання проміжних точок
- Оптимізація порядку waypoints
- Множинні пункти призначення

### 5. Більше метрик

- Вартість палива (поточні ціни)
- Платні дороги
- Висота над рівнем моря
- Складність маршруту

---

## 💡 ПОРАДИ

### Як не застрягти:

1. **Почни з простого** - не намагайся зробити все одразу
2. **Тестуй після кожного кроку** - так легше знайти помилки
3. **Використовуй console.log** - дивись що відбувається
4. **Порівнюй з моїм кодом** - якщо щось не працює
5. **Робі перерви** - 10 хв кожну годину

### Типові помилки:

❌ Забути перевести градуси в радіани (Haversine)
❌ Плутати час (години vs хвилини)
❌ Не округляти числа (некрасивий вивід)
❌ Забути return в методах
❌ Не валідувати coordinates

### Корисні ресурси:

- Haversine formula: https://en.wikipedia.org/wiki/Haversine_formula
- Координати міст: https://www.latlong.net/
- Emoji: https://emojipedia.org/

---

## 🎯 ЦІЛІ НАВЧАННЯ

Після завершення ти будеш розуміти:

✅ Як структурувати великий проєкт
✅ Як поділити завдання на кроки
✅ Як створювати гнучку архітектуру
✅ Як додавати нові features без зміни старого коду
✅ Як тестувати кожен компонент окремо
✅ Як будувати складні системи з простих блоків

**УДАЧІ! 💪**
