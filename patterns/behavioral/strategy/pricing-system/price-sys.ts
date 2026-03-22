// ============================================
// 💰 PRICING SYSTEM - ВИПРАВЛЕНА ВЕРСІЯ
// ============================================

// ============================================
// TYPES
// ============================================

type SeasonType = "summer" | "winter" | "autumn" | "spring";

type PricingArgs = {
  amount: number;
  season?: SeasonType;
  quantity?: number;
  points?: number;
  isFirstTime?: boolean;
};

type PricingResult = {
  originalPrice: number;
  discount: number;
  finalPrice: number;
  strategyName: string;
  discountPercent: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

// ============================================
// INTERFACE
// ============================================

interface IPricingStrategy {
  calculateDiscount(args: PricingArgs): PricingResult;
  getName(): string;
}

// ============================================
// CONCRETE STRATEGIES
// ============================================

// 1. Regular Customer - без знижки
class RegularCustomerPrice implements IPricingStrategy {
  getName(): string {
    return "Regular Customer";
  }

  calculateDiscount({ amount }: PricingArgs): PricingResult {
    return {
      originalPrice: amount,
      discount: 0,
      finalPrice: amount,
      strategyName: this.getName(),
      discountPercent: 0,
    };
  }
}

// 2. Premium Customer - 10% знижка
class PremiumCustomerPrice implements IPricingStrategy {
  getName(): string {
    return "Premium Customer";
  }

  calculateDiscount({ amount }: PricingArgs): PricingResult {
    const discount = amount * 0.1;
    const finalPrice = amount - discount;

    return {
      originalPrice: amount,
      discount,
      finalPrice,
      strategyName: this.getName(),
      discountPercent: 10,
    };
  }
}

// 3. VIP Customer - 20% знижка
class VIPCustomerPrice implements IPricingStrategy {
  getName(): string {
    return "VIP Customer";
  }

  calculateDiscount({ amount }: PricingArgs): PricingResult {
    const discount = amount * 0.2;
    const finalPrice = amount - discount;

    return {
      originalPrice: amount,
      discount,
      finalPrice,
      strategyName: this.getName(),
      discountPercent: 20,
    };
  }
}

// 4. Seasonal Discount - залежить від сезону
class SeasonalDiscountPrice implements IPricingStrategy {
  getName(): string {
    return "Seasonal Discount";
  }

  calculateDiscount({ amount, season = "summer" }: PricingArgs): PricingResult {
    let discountPercent = 0;

    switch (season) {
      case "winter":
        discountPercent = 20; // Зимовий розпродаж
        break;
      case "spring":
        discountPercent = 15; // Весняний розпродаж
        break;
      case "autumn":
        discountPercent = 10; // Осінній розпродаж
        break;
      case "summer":
        discountPercent = 5; // Невеликі знижки влітку
        break;
    }

    const discount = amount * (discountPercent / 100);
    const finalPrice = amount - discount;

    return {
      originalPrice: amount,
      discount,
      finalPrice,
      strategyName: `${this.getName()} (${season})`,
      discountPercent,
    };
  }
}

// 5. Bulk Discount - знижка за кількість товарів
class BulkDiscountPrice implements IPricingStrategy {
  constructor(
    private minQuantity: number = 5,
    private discountRate: number = 15
  ) {}

  getName(): string {
    return "Bulk Discount";
  }

  calculateDiscount({ amount, quantity = 1 }: PricingArgs): PricingResult {
    const discountPercent = quantity >= this.minQuantity ? this.discountRate : 0;
    const discount = amount * (discountPercent / 100);
    const finalPrice = amount - discount;

    return {
      originalPrice: amount,
      discount,
      finalPrice,
      strategyName: `${this.getName()} (${quantity} items)`,
      discountPercent,
    };
  }
}

// 6. First Time Buyer - 15% для нових клієнтів
class FirstTimeBuyerPrice implements IPricingStrategy {
  getName(): string {
    return "First Time Buyer";
  }

  calculateDiscount({ amount, isFirstTime = false }: PricingArgs): PricingResult {
    const discountPercent = isFirstTime ? 15 : 0;
    const discount = amount * (discountPercent / 100);
    const finalPrice = amount - discount;

    return {
      originalPrice: amount,
      discount,
      finalPrice,
      strategyName: this.getName(),
      discountPercent,
    };
  }
}

// 7. Loyalty Points - знижка за бали
class LoyaltyPointsPrice implements IPricingStrategy {
  getName(): string {
    return "Loyalty Points";
  }

  calculateDiscount({ amount, points = 0 }: PricingArgs): PricingResult {
    // 100 балів = $1 знижки
    // Максимум 50% від вартості
    const pointsDiscount = points / 100;
    const maxDiscount = amount * 0.5;
    const discount = Math.min(pointsDiscount, maxDiscount);
    const finalPrice = amount - discount;

    const discountPercent = (discount / amount) * 100;

    return {
      originalPrice: amount,
      discount,
      finalPrice,
      strategyName: `${this.getName()} (${points} pts)`,
      discountPercent,
    };
  }
}

// ============================================
// PRICING MANAGER (Context)
// ============================================

class PricingManager {
  private strategies = new Map<string, IPricingStrategy>();

  register(name: string, strategy: IPricingStrategy): this {
    // Валідація стратегії
    if (!strategy || typeof strategy.calculateDiscount !== "function") {
      throw new Error("Strategy must implement calculateDiscount method");
    }

    // Перевірка чи вже існує
    if (this.hasStrategy(name)) {
      console.warn(`Strategy "${name}" already exists. Skipping.`);
      return this;
    }

    this.strategies.set(name, strategy);
    return this;
  }

  unregister(name: string): this {
    if (!this.hasStrategy(name)) {
      console.warn(`Strategy "${name}" not found. Skipping.`);
      return this;
    }

    this.strategies.delete(name);
    return this;
  }

  hasStrategy(name: string): boolean {
    if (!name) return false;
    return this.strategies.has(name);
  }

  getAvailableStrategies(): string[] {
    return Array.from(this.strategies.keys());
  }

  calculatePrice(strategyName: string, args: PricingArgs): PricingResult {
    const strategy = this.strategies.get(strategyName);

    if (!strategy) {
      const available = this.getAvailableStrategies().join(", ");
      throw new Error(`Strategy "${strategyName}" not found. Available: ${available || "none"}`);
    }

    return strategy.calculateDiscount(args);
  }
}

// ============================================
// SHOPPING CART
// ============================================

class ShoppingCart {
  private items: Product[] = [];
  private pricingManager: PricingManager;
  private currentStrategy: string = "regular";

  constructor(pricingManager: PricingManager) {
    this.pricingManager = pricingManager;
  }

  addItem(name: string, price: number, quantity: number = 1): void {
    const item: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      price,
      quantity,
    };
    this.items.push(item);
  }

  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  getItems(): Product[] {
    return [...this.items];
  }

  getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getTotalQuantity(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  setPricingStrategy(strategyName: string): void {
    if (!this.pricingManager.hasStrategy(strategyName)) {
      throw new Error(`Strategy "${strategyName}" not found`);
    }
    this.currentStrategy = strategyName;
  }

  calculateTotal(extraArgs?: Partial<PricingArgs>): PricingResult {
    const subtotal = this.getSubtotal();
    const quantity = this.getTotalQuantity();

    const args: PricingArgs = {
      amount: subtotal,
      quantity,
      ...extraArgs,
    };

    return this.pricingManager.calculatePrice(this.currentStrategy, args);
  }

  displayCart(): void {
    console.log("\n" + "=".repeat(60));
    console.log("🛒 SHOPPING CART");
    console.log("=".repeat(60));

    if (this.items.length === 0) {
      console.log("Cart is empty");
      console.log("=".repeat(60) + "\n");
      return;
    }

    this.items.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      console.log(
        `${item.name.padEnd(20)} x${item.quantity}  $${item.price.toFixed(2)} = $${itemTotal.toFixed(2)}`
      );
    });

    const result = this.calculateTotal();

    console.log("-".repeat(60));
    console.log(`Items: ${this.items.length} | Quantity: ${this.getTotalQuantity()}`);
    console.log(`Subtotal: $${result.originalPrice.toFixed(2)}`);
    console.log(`Strategy: ${result.strategyName}`);
    console.log(`Discount (${result.discountPercent}%): -$${result.discount.toFixed(2)}`);
    console.log("=".repeat(60));
    console.log(`TOTAL: $${result.finalPrice.toFixed(2)}`);
    console.log("=".repeat(60) + "\n");
  }

  clear(): void {
    this.items = [];
  }
}

// ============================================
// SETUP & EXAMPLES
// ============================================

// Створюємо менеджер цін та реєструємо всі стратегії
const pricingManager = new PricingManager();

pricingManager
  .register("regular", new RegularCustomerPrice())
  .register("premium", new PremiumCustomerPrice())
  .register("vip", new VIPCustomerPrice())
  .register("seasonal", new SeasonalDiscountPrice())
  .register("bulk", new BulkDiscountPrice(5, 15))
  .register("firsttime", new FirstTimeBuyerPrice())
  .register("loyalty", new LoyaltyPointsPrice());

// Створюємо корзину
const cart = new ShoppingCart(pricingManager);

// Додаємо товари
cart.addItem("Laptop", 1000, 1);
cart.addItem("Mouse", 50, 2);
cart.addItem("Keyboard", 150, 1);

console.log("\n🎯 PRICING SYSTEM DEMO\n");

// 1. Regular Customer
console.log("1️⃣ Regular Customer:");
cart.setPricingStrategy("regular");
cart.displayCart();

// 2. Premium Customer
console.log("2️⃣ Premium Customer:");
cart.setPricingStrategy("premium");
cart.displayCart();

// 3. VIP Customer
console.log("3️⃣ VIP Customer:");
cart.setPricingStrategy("vip");
cart.displayCart();

// 4. Seasonal (Winter)
console.log("4️⃣ Seasonal Discount (Winter):");
cart.setPricingStrategy("seasonal");
const winterResult = cart.calculateTotal({ season: "winter" });
console.log(`Original: $${winterResult.originalPrice.toFixed(2)}`);
console.log(`Discount (${winterResult.discountPercent}%): -$${winterResult.discount.toFixed(2)}`);
console.log(`Final: $${winterResult.finalPrice.toFixed(2)}\n`);

// 5. Bulk Discount (додаємо більше товарів)
console.log("5️⃣ Bulk Discount:");
cart.addItem("USB Cable", 10, 3);
cart.setPricingStrategy("bulk");
cart.displayCart();

// 6. First Time Buyer
console.log("6️⃣ First Time Buyer:");
cart.setPricingStrategy("firsttime");
const firstTimeResult = cart.calculateTotal({ isFirstTime: true });
console.log(`Original: $${firstTimeResult.originalPrice.toFixed(2)}`);
console.log(
  `Discount (${firstTimeResult.discountPercent}%): -$${firstTimeResult.discount.toFixed(2)}`
);
console.log(`Final: $${firstTimeResult.finalPrice.toFixed(2)}\n`);

// 7. Loyalty Points
console.log("7️⃣ Loyalty Points (5000 points):");
cart.setPricingStrategy("loyalty");
const loyaltyResult = cart.calculateTotal({ points: 5000 });
console.log(`Original: $${loyaltyResult.originalPrice.toFixed(2)}`);
console.log(`Points: 5000 (=$50 discount)`);
console.log(`Discount: -$${loyaltyResult.discount.toFixed(2)}`);
console.log(`Final: $${loyaltyResult.finalPrice.toFixed(2)}\n`);

// ============================================
// ПОРІВНЯННЯ ВСІХ СТРАТЕГІЙ
// ============================================

function compareAllStrategies(cart: ShoppingCart): void {
  console.log("\n" + "=".repeat(60));
  console.log("📊 COMPARE ALL STRATEGIES");
  console.log("=".repeat(60));

  const strategies = [
    { name: "regular", args: {} },
    { name: "premium", args: {} },
    { name: "vip", args: {} },
    { name: "seasonal", args: { season: "winter" as SeasonType } },
    { name: "bulk", args: {} },
    { name: "firsttime", args: { isFirstTime: true } },
    { name: "loyalty", args: { points: 5000 } },
  ];

  const results: PricingResult[] = [];

  strategies.forEach(({ name, args }) => {
    cart.setPricingStrategy(name);
    const result = cart.calculateTotal(args);
    results.push(result);
  });

  // Сортуємо за найвигіднішою ціною
  results.sort((a, b) => a.finalPrice - b.finalPrice);

  results.forEach((result, index) => {
    const badge = index === 0 ? "🏆 BEST" : "  ";
    console.log(
      `${badge} ${result.strategyName.padEnd(30)} $${result.finalPrice.toFixed(2)} (save $${result.discount.toFixed(2)})`
    );
  });

  console.log("=".repeat(60) + "\n");
}

compareAllStrategies(cart);

// ============================================
// ДОСТУПНІ СТРАТЕГІЇ
// ============================================

console.log("📋 Available Strategies:");
console.log(pricingManager.getAvailableStrategies().join(", "));
console.log();

// ============================================
// ЕКСПОРТ
// ============================================

export {
  BulkDiscountPrice,
  FirstTimeBuyerPrice,
  LoyaltyPointsPrice,
  PremiumCustomerPrice,
  PricingManager,
  RegularCustomerPrice,
  SeasonalDiscountPrice,
  ShoppingCart,
  VIPCustomerPrice,
};
