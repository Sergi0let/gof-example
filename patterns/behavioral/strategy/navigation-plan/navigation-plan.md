# 🗺️ ПОКРОКОВИЙ ПЛАН: Navigation Route Planner

## 📊 ДВА РІВНІ

### 🟢 ПРОСТИЙ (2-3 год) - Без API, мок-дані, базова логіка

### 🔴 СКЛАДНИЙ (5-8 год) - З API, візуалізація, трафік, POI

---

# 🟢 ПРОСТИЙ ВАРІАНТ

## ⏱️ Загальний час: 2-3 години

---

## КРОК 1: БАЗОВІ ТИПИ (15 хв)

### Що робити:

1. Створи файл `route-planner-simple.ts`
2. Додай типи даних

### Код:

```typescript
type Coordinates = {
  lat: number;
  lng: number;
};

type RouteResult = {
  distance: number; // км
  duration: number; // хвилини
  routeType: string;
  description: string;
};
```

### ✅ Перевірка:

- Файл створено?
- Типи скомпілювались?

---

## КРОК 2: ІНТЕРФЕЙС СТРАТЕГІЇ (10 хв)

### Що робити:

Створи інтерфейс для всіх стратегій маршрутів

### Код:

```typescript
interface IRouteStrategy {
  getName(): string;
  calculateRoute(start: Coordinates, end: Coordinates): RouteResult;
}
```

### ✅ Перевірка:

- Інтерфейс створено?

---

## КРОК 3: HAVERSINE FORMULA (20 хв)

### Що робити:

Реалізуй функцію для розрахунку відстані між координатами

### Теорія:

Haversine formula - математична формула для розрахунку найкоротшої відстані між двома точками на сфері (Земля).

### Код:

```typescript
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

// Допоміжна функція
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return hours > 0 ? `${hours} год ${mins} хв` : `${mins} хв`;
}
```

### ✅ Тест:

```typescript
const kyiv = { lat: 50.4501, lng: 30.5234 };
const lviv = { lat: 49.8397, lng: 24.0297 };
console.log(calculateDistance(kyiv, lviv)); // ~470 км
```

---

## КРОК 4: ПЕРША СТРАТЕГІЯ - FastestRoute (15 хв)

### Що робити:

Найшвидший маршрут (через траси, 100 км/год)

### Код:

```typescript
class FastestRoute implements IRouteStrategy {
  getName(): string {
    return "Fastest Route";
  }

  calculateRoute(start: Coordinates, end: Coordinates): RouteResult {
    const distance = calculateDistance(start, end);
    const duration = (distance / 100) * 60; // 100 км/год

    return {
      distance,
      duration,
      routeType: this.getName(),
      description: "Швидкісні траси",
    };
  }
}
```

### ✅ Тест:

```typescript
const strategy = new FastestRoute();
const result = strategy.calculateRoute(kyiv, lviv);
console.log(result); // ~470 км, ~282 хв
```

---

## КРОК 5: ДРУГА СТРАТЕГІЯ - ShortestRoute (15 хв)

### Що робити:

Найкоротший маршрут (через містечка, 70 км/год)

### Код:

```typescript
class ShortestRoute implements IRouteStrategy {
  getName(): string {
    return "Shortest Route";
  }

  calculateRoute(start: Coordinates, end: Coordinates): RouteResult {
    const distance = calculateDistance(start, end);
    const duration = (distance / 70) * 60; // 70 км/год

    return {
      distance,
      duration,
      routeType: this.getName(),
      description: "Прямий шлях через містечка",
    };
  }
}
```

---

## КРОК 6: ТРЕТЯ СТРАТЕГІЯ - ScenicRoute (15 хв)

### Що робити:

Мальовничий маршрут (довший, повільніший, але цікавий)

### Код:

```typescript
class ScenicRoute implements IRouteStrategy {
  getName(): string {
    return "Scenic Route";
  }

  calculateRoute(start: Coordinates, end: Coordinates): RouteResult {
    const baseDistance = calculateDistance(start, end);
    const distance = baseDistance * 1.3; // +30% через огляд місць
    const duration = (distance / 50) * 60; // 50 км/год + зупинки

    return {
      distance: Math.round(distance * 10) / 10,
      duration,
      routeType: this.getName(),
      description: "Через мальовничі місця",
    };
  }
}
```

---

## КРОК 7: НАВІГАТОР (КОНТЕКСТ) (30 хв)

### Що робити:

Створи клас який використовує стратегії

### Код:

```typescript
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
```

---

## КРОК 8: ТЕСТИ (20 хв)

### Що робити:

Протестуй всі стратегії

### Код:

```typescript
console.log("🎯 ROUTE PLANNER - SIMPLE\n");

const navigator = new RouteNavigator();
const kyiv = { lat: 50.4501, lng: 30.5234 };
const lviv = { lat: 49.8397, lng: 24.0297 };

// Тест 1
navigator.setStrategy(new FastestRoute());
navigator.displayRoute(kyiv, lviv);

// Тест 2
navigator.setStrategy(new ShortestRoute());
navigator.displayRoute(kyiv, lviv);

// Тест 3
navigator.setStrategy(new ScenicRoute());
navigator.displayRoute(kyiv, lviv);
```

---

## КРОК 9: ПОРІВНЯННЯ (15 хв)

### Що робити:

Створи функцію порівняння всіх маршрутів

### Код:

```typescript
function compareRoutes(start: Coordinates, end: Coordinates): void {
  console.log("=".repeat(60));
  console.log("📊 ПОРІВНЯННЯ МАРШРУТІВ");
  console.log("=".repeat(60));

  const strategies = [new FastestRoute(), new ShortestRoute(), new ScenicRoute()];

  strategies.forEach((strategy) => {
    const nav = new RouteNavigator(strategy);
    const result = nav.calculateRoute(start, end);
    console.log(
      `${result.routeType.padEnd(20)} ${result.distance} км, ${formatDuration(result.duration)}`
    );
  });

  console.log("=".repeat(60));
}

compareRoutes(kyiv, lviv);
```

---

## ✅ ЧЕКЛИСТ ПРОСТОГО ВАРІАНТУ

- [ ] Створено базові типи
- [ ] Створено інтерфейс IRouteStrategy
- [ ] Реалізовано calculateDistance (Haversine)
- [ ] Реалізовано formatDuration
- [ ] Створено FastestRoute
- [ ] Створено ShortestRoute
- [ ] Створено ScenicRoute
- [ ] Створено RouteNavigator
- [ ] Протестовано всі стратегії
- [ ] Створено compareRoutes
