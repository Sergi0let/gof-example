// ============================================
// TYPES
// ============================================

type AuthResult = {
  success: boolean;
  provider: string;
  message?: string;
};

type LocalCredentials = {
  username: string;
  password: string;
};

type TwitterCredentials = {
  token: string;
};

type OAuthCredentials = {
  token: string;
  refreshToken: string;
};

// ============================================
// STRATEGY INTERFACE
// ============================================
//! Можна так але у OAuthStrantegy через super()
// abstract class Auth {
//   authenticate(args: Record<string, string>): AuthResult {
//     throw new Error("Must be implement method");
//   }
// }

interface IAuthStrategy<T = Record<string, string>> {
  authenticate(credentials: T): AuthResult;
}

class LocalStrategy2 implements IAuthStrategy<LocalCredentials> {
  authenticate(args: LocalCredentials): AuthResult {
    const { password, username } = args;

    if (password === "1234" && username === "Bro") {
      console.log("✓ SUCCESS in local strategy");

      return { success: true, provider: "local" };
    }

    console.log("✗ RROR in local strategy");
    return {
      success: false,
      provider: "local",
      message: "Invalid password or token",
    };
  }
}

class TwitterStrategy2 implements IAuthStrategy<TwitterCredentials> {
  authenticate(args: TwitterCredentials): AuthResult {
    const { token } = args;

    if (token === "1234") {
      console.log("✓ SUCCESS in Twitter strategy");

      return { success: true, provider: "twitter" };
    }

    console.log("✗ ERROR in twitter strategy");

    return {
      success: false,
      provider: "twitter",
      message: "Invalid token",
    };
  }
}

class OAuthStrategy2 implements IAuthStrategy<OAuthCredentials> {
  constructor(private provider: string) {}

  authenticate(args: OAuthCredentials): AuthResult {
    const { token, refreshToken } = args;

    if (token === "4321") {
      console.log(`✓ SUCCESS in ${this.provider} strategy`);

      return { success: true, provider: this.provider };
    }

    console.log(`✗ ERROR in ${this.provider} strategy`);

    return {
      success: false,
      provider: this.provider,
      message: "nvalid token",
    };
  }
}

class AuthManager {
  private strategies = new Map<string, IAuthStrategy>();

  register(name: string, strategy: IAuthStrategy): this {
    if (!strategy || typeof strategy.authenticate !== "function") {
      throw new Error("Strategy must implement authenticate method");
    }

    if (this.hasStrategy(name)) {
      console.log(`Strategy "${name}" already exist. Skipping`);
      return this;
    }

    this.strategies.set(name, strategy);
    return this;
  }

  unregister(name: string): this {
    if (!this.hasStrategy(name)) {
      console.log(`Not found strategy "${name}". Skipping`);
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

  authenticate<T extends Record<string, string>>(strategyName: string, credentials: T): AuthResult {
    const strategy = this.strategies.get(strategyName);

    if (!strategy) {
      const available = this.getAvailableStrategies().join(", ");
      throw new Error(
        `Strategy ${strategyName} is not exist. Available ${available || "none"} strategies`
      );
    }
    return strategy.authenticate(credentials);
  }
}

// ============================================
// USAGE
// ============================================

const auth2 = new AuthManager();

auth2
  .register("local", new LocalStrategy2())
  .register("twitter", new TwitterStrategy2())
  .register("google", new OAuthStrategy2("Google"));

function login<T extends Record<string, string>>(
  provider: string,
  credentials: T
): AuthResult | { success: false; error: string } {
  try {
    return auth2.authenticate(provider, credentials);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}

// Приклади використання
console.log("\n--- Twitter login ---");
login("twitter", { token: "1234" });
login("twitter", { token: "123s4" });

console.log("\n--- Local login ---");
login("local", { username: "Bro", password: "1234" });
login("local", { username: "Frenk", password: "1234" });

console.log("\n--- Google login ---");
login("google", { token: "4321" });
login("google", { token: "0321" });
