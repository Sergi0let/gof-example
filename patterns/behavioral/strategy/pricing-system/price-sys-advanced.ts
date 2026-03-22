// ============================================
// 💰 PRICING SYSTEM - ВИПРАВЛЕНА ВЕРСІЯ
// ============================================

// ============================================
// TYPES
// ============================================

type SeasonType = "summer" | "winter" | "autumn" | "spring";

type ProductType = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type DiscountArgs = {
  amount: number;
  season?: SeasonType;
  quantity?: number;
  points?: number;
  isFirstTime?: boolean;
};

type DiscountResult = {
  originalPrice: number;
  discount: number;
  finalPrice: number;
  strategyName: string;
  discountPercent: number;
};

// ============================================
// INTERFACE
// ============================================

interface IPricingStrategy {
  getName(): string;
  calculateDiscount(args: DiscountArgs): DiscountResult;
}

// ============================================
// STRATEGIES
// ============================================

class RegularCustomerPrice implements IPricingStrategy {
  getName(): string {
    return "Regular Customer";
  }

  calculateDiscount({ amount }: DiscountArgs): DiscountResult {
    return {
      originalPrice: amount,
      discount: 0,
      finalPrice: amount,
      strategyName: this.getName(),
      discountPercent: 0,
    };
  }
}

class PremiumCustomerPrice implements IPricingStrategy {
  getName(): string {
    return "Premium Customer";
  }

  calculateDiscount({ amount }: DiscountArgs): DiscountResult {
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

class VIPCustomerPrice implements IPricingStrategy {
  getName(): string {
    return "VIP Customer";
  }

  calculateDiscount({ amount }: DiscountArgs): DiscountResult {
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

class SeasonalDiscountPrice implements IPricingStrategy {
  getName(): string {
    return "Seasonal Discount";
  }

  calculateDiscount({ amount, season = "autumn" }: DiscountArgs): DiscountResult {
    const discounts: Record<SeasonType, number> = {
      winter: 20,
      spring: 15,
      summer: 5,
      autumn: 10,
    };
    const discount = amount * (discounts[season] / 100);
    const finalPrice = amount - discount;

    return {
      originalPrice: amount,
      discount,
      finalPrice,
      strategyName: `${this.getName()} (${season})`,
      discountPercent: discounts[season],
    };
  }
}

class BulkDiscountPrice implements IPricingStrategy {
  constructor(
    private minQuantity: number = 5,
    private discountRate: number = 15
  ) {}

  getName(): string {
    return "Bulk Discount";
  }

  calculateDiscount({ amount, quantity = 1 }: DiscountArgs): DiscountResult {
    const dynamicDiscount = quantity >= this.minQuantity ? this.discountRate : 0;
    const discount = amount * (dynamicDiscount / 100);
    const finalPrice = amount - discount;

    return {
      originalPrice: amount,
      discount,
      finalPrice,
      strategyName: `${this.getName()} (${quantity} items)`,
      discountPercent: dynamicDiscount,
    };
  }
}

class FirstTimeBuyerPrice implements IPricingStrategy {
  getName(): string {
    return "First Time Buyer";
  }

  calculateDiscount({ amount, isFirstTime = false }: DiscountArgs): DiscountResult {
    const dynamicDiscount = isFirstTime ? 15 : 0;
    const discount = amount * (dynamicDiscount / 100);
    const finalPrice = amount - discount;

    return {
      originalPrice: amount,
      discount,
      finalPrice,
      strategyName: this.getName(),
      discountPercent: dynamicDiscount,
    };
  }
}

class LoyaltyPointsPrice implements IPricingStrategy {
  getName(): string {
    return "Loyalty Points";
  }

  calculateDiscount({ amount, points = 0 }: DiscountArgs): DiscountResult {
    const pointsDiscount = points / 100;
    const discount = Math.min(pointsDiscount, amount * 0.5);
    const finalPrice = amount - discount;

    return {
      originalPrice: amount,
      discount,
      finalPrice,
      strategyName: `${this.getName()} (${points}pts)`,
      discountPercent: (discount / amount) * 100,
    };
  }
}

// ============================================
// PRICING MANAGER
// ============================================

class PricingManager {
  private strategies: Map<string, IPricingStrategy>;

  constructor() {
    this.strategies = new Map();
  }

  register(name: string, strategy: IPricingStrategy): this {
    if (!strategy || typeof strategy.calculateDiscount !== "function") {
      throw new Error("Strategy must implement calculateDiscount method");
    }

    if (this.strategies.has(name)) {
      console.warn(`Strategy "${name}" already exists. Skipping.`);
      return this;
    }

    this.strategies.set(name, strategy);
    return this;
  }

  unregister(name: string): this {
    if (!this.strategies.has(name)) {
      console.warn(`Strategy "${name}" not found. Skipping.`);
      return this;
    }

    this.strategies.delete(name);
    return this;
  }

  hasStrategy(name: string): boolean {
    return name ? this.strategies.has(name) : false;
  }

  getAvailableStrategies(): string[] {
    return this.strategies.size ? Array.from(this.strategies.keys()) : [];
  }

  calculatePrice(strategyName: string, args: DiscountArgs): DiscountResult {
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
  private items: ProductType[] = [];
  private activeStrategies: string[] = [];

  constructor(private pricingManager: PricingManager) {}

  addItem(name: string, price: number, quantity: number = 1): void {
    const product: ProductType = {
      name,
      price,
      quantity,
      id: Math.random().toString(36).substring(2, 9),
    };
    this.items.push(product);
  }

  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  getItems(): ProductType[] {
    return [...this.items];
  }

  getSubtotal(): number {
    return this.items.reduce((acc, { price, quantity }) => price * quantity + acc, 0);
  }

  getTotalQuantity(): number {
    return this.items.reduce((acc, { quantity }) => acc + quantity, 0);
  }

  addPricingStrategy(strategyName: string): void {
    if (!this.pricingManager.hasStrategy(strategyName)) {
      throw new Error(`Strategy "${strategyName}" not found in PricingManager`);
    }

    if (this.activeStrategies.includes(strategyName)) {
      console.warn(`Strategy "${strategyName}" already active. Skipping.`);
      return;
    }

    this.activeStrategies.push(strategyName);
  }

  setPricingStrategy(strategyName: string): void {
    this.clearStrategies();
    this.addPricingStrategy(strategyName);
  }

  getActiveStrategies(): string[] {
    return [...this.activeStrategies];
  }

  removePricingStrategy(strategyName: string): void {
    if (!strategyName) {
      console.warn("Strategy name cannot be empty");
      return;
    }

    if (!this.activeStrategies.includes(strategyName)) {
      console.warn(`Strategy "${strategyName}" not found in active strategies`);
      return;
    }

    this.activeStrategies = this.activeStrategies.filter((strategy) => strategy !== strategyName);
  }

  clearStrategies(): void {
    this.activeStrategies = [];
  }

  calculateTotal(
    extraArgs?: Partial<DiscountArgs>,
    combineMethod: "add" | "multiply" = "add"
  ): DiscountResult {
    const subtotal = this.getSubtotal();
    const quantity = this.getTotalQuantity();

    const args: DiscountArgs = {
      amount: subtotal,
      quantity,
      ...extraArgs,
    };

    // Якщо немає стратегій
    if (this.activeStrategies.length === 0) {
      return {
        discount: 0,
        discountPercent: 0,
        finalPrice: subtotal,
        originalPrice: subtotal,
        strategyName: "No discount",
      };
    }

    // Якщо одна стратегія
    if (this.activeStrategies.length === 1) {
      return this.pricingManager.calculatePrice(this.activeStrategies[0], args);
    }

    // Якщо кілька - комбінувати
    return this.combineStrategies(args, combineMethod);
  }

  private combineStrategies(
    args: DiscountArgs,
    combineMethod: "add" | "multiply" = "add"
  ): DiscountResult {
    let totalDiscount = 0;
    let currentAmount = args.amount;
    const strategyNames: string[] = [];
    const details: string[] = [];

    console.log(
      `\n🔄 Combining ${this.activeStrategies.length} strategies (method: ${combineMethod})`
    );
    console.log(`💰 Starting amount: $${args.amount.toFixed(2)}`);

    for (let strategyName of this.activeStrategies) {
      const result = this.pricingManager.calculatePrice(strategyName, {
        ...args,
        amount: currentAmount,
      });

      strategyNames.push(result.strategyName);

      if (combineMethod === "add") {
        const discountFromOriginal = (args.amount * result.discountPercent) / 100;
        totalDiscount += discountFromOriginal;
        details.push(
          `  - ${result.strategyName}: ${result.discountPercent}% = $${discountFromOriginal.toFixed(2)}`
        );
      } else {
        totalDiscount += result.discount;
        details.push(
          `  - ${result.strategyName}: ${result.discountPercent}% of $${currentAmount.toFixed(2)} = $${result.discount.toFixed(2)}`
        );
        currentAmount = result.finalPrice;
      }
    }

    console.log("📊 Breakdown:");
    details.forEach((d) => console.log(d));

    const finalPrice = args.amount - totalDiscount;
    const discountPercent = (totalDiscount / args.amount) * 100;

    console.log(`💸 Total discount: $${totalDiscount.toFixed(2)} (${discountPercent.toFixed(1)}%)`);
    console.log(`🎉 Final price: $${finalPrice.toFixed(2)}\n`);

    return {
      originalPrice: args.amount,
      discount: totalDiscount,
      finalPrice: finalPrice < 0 ? 0 : finalPrice,
      strategyName: strategyNames.join(" + "),
      discountPercent,
    };
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
    console.log(`Active Strategies: ${this.activeStrategies.join(", ") || "None"}`);
    console.log(
      `Discount (${result.discountPercent.toFixed(1)}%): -$${result.discount.toFixed(2)}`
    );
    console.log("=".repeat(60));
    console.log(`TOTAL: $${result.finalPrice.toFixed(2)}`);
    console.log("=".repeat(60) + "\n");
  }

  clear(): void {
    this.items = [];
  }
}

// ============================================
// ДЕМО
// ============================================

console.log("\n" + "=".repeat(70));
console.log("🎯 DEMO: КОМБІНУВАННЯ СТРАТЕГІЙ ЗНИЖОК");
console.log("=".repeat(70));

// Створюємо менеджер і реєструємо стратегії
const pricingManager = new PricingManager();
pricingManager
  .register("regular", new RegularCustomerPrice())
  .register("vip", new VIPCustomerPrice())
  .register("premium", new PremiumCustomerPrice())
  .register("seasonal", new SeasonalDiscountPrice())
  .register("bulk", new BulkDiscountPrice())
  .register("firsttime", new FirstTimeBuyerPrice())
  .register("loyalty", new LoyaltyPointsPrice());

// Створюємо кошик
const cart = new ShoppingCart(pricingManager);

// Додаємо товари
cart.addItem("Laptop", 1000, 1);
cart.addItem("Mouse", 50, 2);

// ============================================
// ТЕСТ 1: ОДНА СТРАТЕГІЯ
// ============================================

console.log("\n📌 TEST 1: Одна стратегія (VIP)");
console.log("-".repeat(70));
cart.setPricingStrategy("vip");
cart.displayCart();

// ============================================
// ТЕСТ 2: ДВІ СТРАТЕГІЇ (ADD METHOD)
// ============================================

console.log("\n📌 TEST 2: Дві стратегії - ADD method");
console.log("-".repeat(70));
console.log("💡 ADD: Додаємо відсотки обох знижок");
cart.clearStrategies();
cart.addPricingStrategy("vip");
cart.addPricingStrategy("seasonal");

const result2 = cart.calculateTotal({ season: "winter" }, "add");
console.log(`Result: ${result2.strategyName} → $${result2.finalPrice.toFixed(2)}`);

// ============================================
// ТЕСТ 3: ДВІ СТРАТЕГІЇ (MULTIPLY METHOD)
// ============================================

console.log("\n📌 TEST 3: Дві стратегії - MULTIPLY method");
console.log("-".repeat(70));
console.log("💡 MULTIPLY: Послідовно застосовуємо знижки");

const result3 = cart.calculateTotal({ season: "winter" }, "multiply");
console.log(`Result: ${result3.strategyName} → $${result3.finalPrice.toFixed(2)}`);

console.log("\n" + "=".repeat(70));
console.log("✅ ВСІ ТЕСТИ ПРОЙШЛИ УСПІШНО!");
console.log("=".repeat(70) + "\n");
