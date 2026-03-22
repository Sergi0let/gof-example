# 📋 ТЕХНІЧНЕ ЗАВДАННЯ: Система кошика з знижками

## 1. ЗАГАЛЬНИЙ ОПИС ПРОЄКТУ

### 1.1 Мета

Розробити систему інтернет-магазину з кошиком покупок та гнучкою системою знижок, використовуючи патерн Strategy.

### 1.2 Основний функціонал

- Додавання/видалення товарів до кошика
- Підрахунок загальної суми
- Застосування різних стратегій знижок
- Відображення деталей замовлення

---

## 2. ВИМОГИ ДО ТИПІВ ДАНИХ

### 2.1 Тип Product (Товар)

```typescript
type Product = {
  id: string; // Унікальний ідентифікатор
  name: string; // Назва товару
  price: number; // Ціна за одиницю
  quantity: number; // Кількість
};
```

**Приклад:**

```typescript
{
  id: "abc123",
  name: "Laptop",
  price: 1000,
  quantity: 2
}
```

### 2.2 Тип DiscountArgs (Аргументи для знижки)

```typescript
type DiscountArgs = {
  amount: number; // Сума замовлення
  season?: "winter" | "summer" | "autumn" | "spring"; // Сезон (опціонально)
  quantity?: number; // Загальна кількість товарів (опціонально)
  points?: number; // Бали лояльності (опціонально)
  isFirstTime?: boolean; // Перша покупка (опціонально)
};
```

### 2.3 Тип DiscountResult (Результат розрахунку знижки)

```typescript
type DiscountResult = {
  originalPrice: number; // Початкова ціна
  discount: number; // Сума знижки в грошах
  finalPrice: number; // Фінальна ціна після знижки
  strategyName: string; // Назва застосованої стратегії
  discountPercent: number; // Відсоток знижки
};
```

**Приклад:**

```typescript
{
  originalPrice: 1000,
  discount: 200,
  finalPrice: 800,
  strategyName: "VIP Customer",
  discountPercent: 20
}
```

---

## 3. СТРАТЕГІЇ ЗНИЖОК (Pricing Strategies)

### 3.1 Інтерфейс IPricingStrategy

```typescript
interface IPricingStrategy {
  calculateDiscount(args: DiscountArgs): DiscountResult;
  getName(): string;
}
```

### 3.2 Список обов'язкових стратегій

#### 3.2.1 RegularCustomerPrice

- **Опис:** Звичайний клієнт без знижки
- **Знижка:** 0%
- **Назва:** "Regular Customer"

#### 3.2.2 PremiumCustomerPrice

- **Опис:** Преміум клієнт
- **Знижка:** 10%
- **Назва:** "Premium Customer"

#### 3.2.3 VIPCustomerPrice

- **Опис:** VIP клієнт
- **Знижка:** 20%
- **Назва:** "VIP Customer"

#### 3.2.4 SeasonalDiscountPrice

- **Опис:** Сезонні знижки
- **Знижки:**
  - Зима (winter): 20%
  - Весна (spring): 15%
  - Осінь (autumn): 10%
  - Літо (summer): 5%
- **Назва:** "Seasonal Discount"
- **Вхідні дані:** Потребує параметр `season` в `DiscountArgs`

#### 3.2.5 BulkDiscountPrice

- **Опис:** Оптова знижка за кількість товарів
- **Параметри конструктора:**
  - `minQuantity: number` (за замовчуванням 5) - мінімальна кількість для знижки
  - `discountRate: number` (за замовчуванням 15) - відсоток знижки
- **Логіка:**
  - Якщо `quantity >= minQuantity` → застосувати знижку
  - Інакше → знижка 0%
- **Назва:** "Bulk Discount"
- **Вхідні дані:** Потребує параметр `quantity` в `DiscountArgs`

#### 3.2.6 FirstTimeBuyerPrice

- **Опис:** Знижка для нових клієнтів
- **Знижка:** 15% (тільки якщо `isFirstTime === true`)
- **Назва:** "First Time Buyer"
- **Вхідні дані:** Потребує параметр `isFirstTime` в `DiscountArgs`

#### 3.2.7 LoyaltyPointsPrice

- **Опис:** Знижка за бали лояльності
- **Логіка:**
  - 100 балів = $1 знижки
  - Максимальна знижка: 50% від вартості
- **Формула:** `pointsDiscount = points / 100`
- **Обмеження:** `discount = Math.min(pointsDiscount, amount * 0.5)`
- **Назва:** "Loyalty Points"
- **Вхідні дані:** Потребує параметр `points` в `DiscountArgs`

---

## 4. PRICING MANAGER (Менеджер стратегій)

### 4.1 Клас PricingManager

#### 4.1.1 Приватні поля

```typescript
private strategies: Map<string, IPricingStrategy>
```

#### 4.1.2 Методи

**register(name: string, strategy: IPricingStrategy): this**

- **Опис:** Реєструє нову стратегію
- **Валідація:**
  - Перевірити що strategy не null/undefined
  - Перевірити що strategy має метод `calculateDiscount`
  - Якщо стратегія вже існує → вивести warning і пропустити
- **Повертає:** `this` (для method chaining)

**unregister(name: string): this**

- **Опис:** Видаляє стратегію
- **Логіка:**
  - Якщо стратегії не існує → вивести warning
  - Видалити зі Map
- **Повертає:** `this`

**hasStrategy(name: string): boolean**

- **Опис:** Перевіряє чи існує стратегія
- **Валідація:** Якщо `name` порожній → повернути `false`
- **Повертає:** `boolean`

**getAvailableStrategies(): string[]**

- **Опис:** Повертає список назв всіх зареєстрованих стратегій
- **Повертає:** Масив рядків

**calculatePrice(strategyName: string, args: DiscountArgs): DiscountResult**

- **Опис:** Виконує розрахунок знижки за допомогою обраної стратегії
- **Валідація:**
  - Якщо стратегія не знайдена → викинути помилку з переліком доступних стратегій
- **Повертає:** `DiscountResult`

---

## 5. SHOPPING CART (Кошик)

### 5.1 Клас ShoppingCart

#### 5.1.1 Приватні поля

```typescript
private items: Product[] = [];
private pricingManager: PricingManager;
private currentStrategy: string = "regular";
```

#### 5.1.2 Конструктор

```typescript
constructor(pricingManager: PricingManager)
```

- Приймає екземпляр `PricingManager`
- Зберігає його в приватному полі

#### 5.1.3 Методи

**addItem(name: string, price: number, quantity: number = 1): void**

- **Опис:** Додає товар до кошика
- **Логіка:**
  - Створити новий `Product` з унікальним `id`
  - Додати до масиву `items`
- **Генерація ID:** `Math.random().toString(36).substr(2, 9)`

**removeItem(id: string): void**

- **Опис:** Видаляє товар з кошика за ID
- **Логіка:** Фільтрувати масив `items`

**getItems(): Product[]**

- **Опис:** Повертає копію масиву товарів
- **Повертає:** `[...this.items]`

**getSubtotal(): number**

- **Опис:** Рахує загальну суму без знижок
- **Формула:** `sum(price * quantity)` для всіх товарів
- **Повертає:** `number`

**getTotalQuantity(): number**

- **Опис:** Рахує загальну кількість товарів
- **Формула:** `sum(quantity)` для всіх товарів
- **Повертає:** `number`

**setPricingStrategy(strategyName: string): void**

- **Опис:** Встановлює активну стратегію знижок
- **Валідація:** Перевірити що стратегія існує через `pricingManager.hasStrategy()`
- **Помилка:** Якщо не існує → викинути помилку

**calculateTotal(extraArgs?: Partial<DiscountArgs>): DiscountResult**

- **Опис:** Рахує фінальну суму з знижкою
- **Логіка:**
  1. Отримати `subtotal` через `getSubtotal()`
  2. Отримати `quantity` через `getTotalQuantity()`
  3. Створити об'єкт `args: DiscountArgs` з цими даними + `extraArgs`
  4. Викликати `pricingManager.calculatePrice(currentStrategy, args)`
- **Повертає:** `DiscountResult`

**displayCart(): void**

- **Опис:** Виводить кошик в консоль у красивому форматі
- **Формат:**

```
============================================================
🛒 SHOPPING CART
============================================================
Laptop               x1  $1000.00 = $1000.00
Mouse                x2  $50.00 = $100.00
------------------------------------------------------------
Items: 2 | Quantity: 3
Subtotal: $1100.00
Strategy: Premium Customer
Discount (10%): -$110.00
============================================================
TOTAL: $990.00
============================================================
```

**clear(): void**

- **Опис:** Очищає кошик
- **Логіка:** `this.items = []`

---

## 6. ПРИКЛАД ВИКОРИСТАННЯ

### 6.1 Ініціалізація

```typescript
// 1. Створити менеджер
const pricingManager = new PricingManager();

// 2. Зареєструвати стратегії
pricingManager
  .register("regular", new RegularCustomerPrice())
  .register("premium", new PremiumCustomerPrice())
  .register("vip", new VIPCustomerPrice())
  .register("seasonal", new SeasonalDiscountPrice())
  .register("bulk", new BulkDiscountPrice(5, 15))
  .register("firsttime", new FirstTimeBuyerPrice())
  .register("loyalty", new LoyaltyPointsPrice());

// 3. Створити кошик
const cart = new ShoppingCart(pricingManager);
```

### 6.2 Базовий сценарій

```typescript
// Додати товари
cart.addItem("Laptop", 1000, 1);
cart.addItem("Mouse", 50, 2);

// Встановити стратегію
cart.setPricingStrategy("premium");

// Показати кошик
cart.displayCart();

// Отримати результат
const result = cart.calculateTotal();
console.log(result);
```

### 6.3 Складний сценарій (з додатковими параметрами)

```typescript
// Сезонна знижка
cart.setPricingStrategy("seasonal");
const winterResult = cart.calculateTotal({ season: "winter" });

// Бали лояльності
cart.setPricingStrategy("loyalty");
const loyaltyResult = cart.calculateTotal({ points: 5000 });

// Перша покупка
cart.setPricingStrategy("firsttime");
const firstTimeResult = cart.calculateTotal({ isFirstTime: true });
```

---

## 7. ВИМОГИ ДО РЕАЛІЗАЦІЇ

### 7.1 TypeScript

- Всі типи мають бути явно вказані
- Використовувати `interface` для стратегій
- Використовувати `type` для даних
- Приватні поля позначати `private` або `#`

### 7.2 Валідація

- Перевіряти всі вхідні параметри
- Виводити `console.warn` для попереджень
- Викидати `Error` для критичних помилок

### 7.3 Форматування

- Числа з грошима форматувати з 2 знаками після коми: `toFixed(2)`
- Відсотки виводити як цілі числа: `discountPercent: 15` (не 0.15)

### 7.4 Method Chaining

- Методи `register()` та `unregister()` мають повертати `this`

---

## 8. КРИТЕРІЇ ПРИЙНЯТТЯ

### 8.1 Функціональність

- [ ] Всі 7 стратегій реалізовані
- [ ] PricingManager коректно управляє стратегіями
- [ ] ShoppingCart додає/видаляє товари
- [ ] Підрахунок знижок працює коректно
- [ ] displayCart() виводить красивий формат

### 8.2 Якість коду

- [ ] Немає помилок TypeScript
- [ ] Всі типи явно вказані
- [ ] Валідація вхідних даних
- [ ] Коментарі в складних місцях

### 8.3 Тестування

- [ ] Перевірено всі стратегії окремо
- [ ] Перевірено додавання товарів
- [ ] Перевірено зміну стратегій
- [ ] Перевірено обробку помилок

---

## 9. ДОДАТКОВІ ЗАВДАННЯ (ОПЦІОНАЛЬНО)

### 9.1 Розширення функціоналу

- [ ] Комбінування двох стратегій одночасно
- [ ] Історія застосованих знижок
- [ ] Мінімальна сума для активації знижки
- [ ] Валідні періоди для сезонних знижок

### 9.2 Покращення UX

- [ ] Функція порівняння всіх стратегій
- [ ] Рекомендація найвигіднішої стратегії
- [ ] Експорт кошика в JSON
- [ ] Збереження/завантаження стану кошика

---

## 10. КОНТРОЛЬНІ ТОЧКИ

### Checkpoint 1: Типи та інтерфейс (30 хв)

- Створено всі типи
- Створено інтерфейс `IPricingStrategy`

### Checkpoint 2: Прості стратегії (1 год)

- Реалізовано Regular, Premium, VIP

### Checkpoint 3: Складні стратегії (1.5 год)

- Реалізовано Seasonal, Bulk, FirstTime, Loyalty

### Checkpoint 4: PricingManager (1 год)

- Реалізовано всі методи менеджера
- Додано валідацію

### Checkpoint 5: ShoppingCart (1.5 год)

- Реалізовано всі методи кошика
- Додано displayCart()

### Checkpoint 6: Тестування (30 хв)

- Перевірено всі сценарії
- Виправлено баги

**Загальний час: 5-6 годин**

---

## 11. ПІДКАЗКИ ДЛЯ РОЗРОБКИ

### 11.1 З чого почати

1. Створи файл `pricing-system.ts`
2. Спочатку напиши всі типи
3. Потім інтерфейс
4. Потім одну просту стратегію
5. Протестуй її окремо
6. Додай решту стратегій
7. Створи PricingManager
8. Створи ShoppingCart
9. Протестуй все разом

### 11.2 Як тестувати

Після кожної стратегії пиши маленький тест:

```typescript
const strategy = new RegularCustomerPrice();
console.log(strategy.calculateDiscount({ amount: 100 }));
// Очікуєш: { ..., finalPrice: 100, discount: 0 }
```

### 11.3 Де застрягти легко

- Форматування виводу в `displayCart()`
- Логіка `LoyaltyPoints` з обмеженням 50%
- Валідація в `PricingManager`
- Method chaining (не забудь `return this`)

---

## 12. УСПІХ!

Коли все працює, ти побачиш щось таке:

```
🛒 Shopping Cart with 3 items
💰 Subtotal: $1250.00
🎯 Strategy: VIP Customer (20% off)
💵 Final Price: $1000.00
💸 You saved: $250.00!
```

**Удачі! 💪**
