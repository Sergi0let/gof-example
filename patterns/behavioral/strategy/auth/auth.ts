interface Interface {
  authenticate(args: []): boolean;
}

class TwitterS implements Interface {
  authenticate(args: any[]): boolean {
    const [password] = args;

    if (password === "4444") {
      return true;
    }
    return false;
  }
}

class OAuth implements Interface {
  authenticate(args: any[]): boolean {
    const [token] = args;

    if (token) {
      console.log("3".repeat(55));
      return true;
    }

    return false;
  }
}

class Authen {
  strategy = new Map<string, Interface>();

  use(name: string, strategy: Interface) {
    if (this.strategy.has(name)) return this;

    this.strategy.set(name, strategy);

    return this;
  }

  authenticate(name: string, ...args: any) {
    if (!this.strategy.has(name)) return;

    const currentStrategy = this.strategy.get(name);

    currentStrategy?.authenticate(args);
  }
}

const st = new Authen();

st.use("twitter", new TwitterS()).use("oauth", new OAuth());

function getS(name: string, ...args: any) {
  st.authenticate(name, args);
}
getS("oauth", "ddddd");

// Problem wich we have
/*
function login(mode) {
  if (mode === "accout") {
    loginWithPassport();
  } else if (mode === "email") {
    loginWithEmail();
  } else if (mode === "mobile") {
    loginWithMobile();
  }
    ...
    ...
}
*/

// Strategy PATTERN

interface Strategy {
  authenticate(args: any[]): boolean;
}

class TwitterStrategy implements Strategy {
  authenticate(args: any[]): boolean {
    const [token] = args;

    if (token !== "pw123") {
      console.log("Not allowed form Twitter auth");
      return false;
    }

    console.log("Auth from Twitter success");
    return true;
  }
}

class LocalStrategy implements Strategy {
  authenticate(args: any[]): boolean {
    const [username, password] = args;

    if (username !== "bro" && password !== "666") {
      console.log("Not wright password or username");
      return false;
    }

    console.log("Auth by login and password pass success:");
    return true;
  }
}

class Authenticator {
  strategies: Record<string, Strategy> = {};

  use(name: string, strategy: Strategy) {
    this.strategies[name] = strategy;
  }

  authenticate(name: string, ...args: any) {
    if (!this.strategies[name]) {
      console.error("Strategy not implement");
      return false;
    }

    return this.strategies[name].authenticate.apply(null, args);
  }
}

const auth = new Authenticator();

auth.use("twitter", new TwitterStrategy());
auth.use("local", new LocalStrategy());

function login(mode: string, ...args: any) {
  return auth.authenticate(mode, args);
}

login("twitter", "pw123");
login("local", "bro", "666");
