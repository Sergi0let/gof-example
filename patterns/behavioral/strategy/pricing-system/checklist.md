# ✅ ЧЕКЛИСТ: Shopping Cart з Strategy Pattern

## 📦 ЩО ТРЕБА ЗРОБИТИ

### КРОК 1: Типи (15 хв)

```typescript
- [ ] type Product (id, name, price, quantity)
- [ ] type DiscountArgs (amount, season?, quantity?, points?, isFirstTime?)
- [ ] type DiscountResult (originalPrice, discount, finalPrice, strategyName, discountPercent)
- [ ] interface IPricingStrategy (calculateDiscount, getName)
```

### КРОК 2: Стратегії (2 год)

```typescript
- [ ] RegularCustomerPrice - 0% знижка
- [ ] PremiumCustomerPrice - 10% знижка
- [ ] VIPCustomerPrice - 20% знижка
- [ ] SeasonalDiscountPrice - залежить від сезону (winter:20%, spring:15%, autumn:10%, summer:5%)
- [ ] BulkDiscountPrice - якщо quantity >= 5 то 15% знижка
- [ ] FirstTimeBuyerPrice - якщо isFirstTime то 15% знижка
- [ ] LoyaltyPointsPrice - 100 балів = $1, max 50% знижки
```

### КРОК 3: PricingManager (1 год)

```typescript
- [ ] private strategies: Map<string, IPricingStrategy>
- [ ] register(name, strategy): this
- [ ] unregister(name): this
- [ ] hasStrategy(name): boolean
- [ ] getAvailableStrategies(): string[]
- [ ] calculatePrice(strategyName, args): DiscountResult
```

### КРОК 4: ShoppingCart (1.5 год)

```typescript
- [ ] private items: Product[]
- [ ] private pricingManager: PricingManager
- [ ] private currentStrategy: string
- [ ] constructor(pricingManager)
- [ ] addItem(name, price, quantity)
- [ ] removeItem(id)
- [ ] getItems(): Product[]
- [ ] getSubtotal(): number
- [ ] getTotalQuantity(): number
- [ ] setPricingStrategy(strategyName)
- [ ] calculateTotal(extraArgs?): DiscountResult
- [ ] displayCart()
- [ ] clear()
```

### КРОК 5: Тести (30 хв)

```typescript
- [ ] Створити pricingManager
- [ ] Зареєструвати всі 7 стратегій
- [ ] Створити cart
- [ ] Додати 2-3 товари
- [ ] Протестувати кожну стратегію
- [ ] Перевірити displayCart()
```

---

## 🎯 ШВИДКІ ПІДКАЗКИ

### Генерація ID

```typescript
id: Math.random().toString(36).substr(2, 9);
```

### Підрахунок знижки

```typescript
const discount = amount * (discountPercent / 100);
const finalPrice = amount - discount;
```

### Seasonal знижки

```typescript
switch (season) {
  case "winter":
    discountPercent = 20;
    break;
  case "spring":
    discountPercent = 15;
    break;
  case "autumn":
    discountPercent = 10;
    break;
  case "summer":
    discountPercent = 5;
    break;
}
```

### Bulk знижки

```typescript
const discountPercent = quantity >= this.minQuantity ? this.discountRate : 0;
```

### Loyalty знижки

```typescript
const pointsDiscount = points / 100;
const maxDiscount = amount * 0.5;
const discount = Math.min(pointsDiscount, maxDiscount);
```

### Method chaining

```typescript
register(name: string, strategy: IPricingStrategy): this {
  // ... логіка
  return this; // ← Важливо!
}
```

### Валідація стратегії

```typescript
if (!strategy || typeof strategy.calculateDiscount !== "function") {
  throw new Error("Strategy must implement calculateDiscount method");
}
```

### Форматування грошей

```typescript
`$${price.toFixed(2)}`; // $123.45
```

---

## 🧪 ШВИДКІ ТЕСТИ

### Тест стратегії

```typescript
const strategy = new PremiumCustomerPrice();
const result = strategy.calculateDiscount({ amount: 100 });
console.assert(result.finalPrice === 90, "Premium should be 10% off");
```

### Тест кошика

```typescript
cart.addItem("Laptop", 1000, 1);
console.assert(cart.getSubtotal() === 1000, "Subtotal should be 1000");
```

### Тест знижки

```typescript
cart.setPricingStrategy("vip");
const result = cart.calculateTotal();
console.assert(result.finalPrice === 800, "VIP should be 20% off");
```

---

## ⏱️ ТАЙМЛАЙН

- **0:00-0:15** - Створити типи
- **0:15-0:45** - Зробити 3 прості стратегії (Regular, Premium, VIP)
- **0:45-1:30** - Зробити 4 складні стратегії (Seasonal, Bulk, FirstTime, Loyalty)
- **1:30-2:00** - Протестувати стратегії
- **2:00-2:45** - Створити PricingManager
- **2:45-4:00** - Створити ShoppingCart
- **4:00-4:30** - Фінальне тестування

**Загалом: 4-5 годин**

---

## 🎓 ЯК НЕ ЗАСТРЯГТИ

### Проблема: "Не знаю з чого почати"

→ Почни з типів. Спочатку `Product`, потім інтерфейс `IPricingStrategy`.

### Проблема: "Стратегія не працює"

→ Протестуй її окремо з `console.log` перед тим як додавати в менеджер.

### Проблема: "Складно з displayCart()"

→ Залиш її на потім. Спочатку зроби базову функціональність.

### Проблема: "Не розумію як працює Map"

→ `map.set(key, value)` - додати, `map.get(key)` - отримати, `map.has(key)` - перевірити.

### Проблема: "Loyalty Points складна"

→ Формула: `Math.min(points / 100, amount * 0.5)` - менше з двох значень.

---

## ✨ ФІНАЛЬНИЙ РЕЗУЛЬТАТ

Коли все готово, запусти:

```typescript
const pricingManager = new PricingManager();
pricingManager
  .register("regular", new RegularCustomerPrice())
  .register("vip", new VIPCustomerPrice());

const cart = new ShoppingCart(pricingManager);
cart.addItem("Laptop", 1000, 1);
cart.setPricingStrategy("vip");
cart.displayCart();
```

Побачиш:

```
============================================================
🛒 SHOPPING CART
============================================================
Laptop               x1  $1000.00 = $1000.00
------------------------------------------------------------
Items: 1 | Quantity: 1
Subtotal: $1000.00
Strategy: VIP Customer
Discount (20%): -$200.00
============================================================
TOTAL: $800.00
============================================================
```

**Успіху! 💪**
