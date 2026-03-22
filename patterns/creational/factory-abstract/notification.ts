// =================================================================
// PATTERN: Abstract Factory
//
// Problem it solves: you need to create a FAMILY of related objects
// that must be consistent with each other.
//
// Our case: Web notifications look like toasts, Mobile look like
// push-banners. You never want to mix Web toast with Mobile banner
// in the same app — the factory guarantees consistency.
//
// Structure:
//   INotifyFactory          ← abstract factory interface
//       WebNotifyFactory    ← concrete factory: creates Web family
//       MobileNotifyFactory ← concrete factory: creates Mobile family
//
//   Each factory produces:
//       createSuccess() → INotify
//       createError()   → INotify
//       createWarning() → INotify
//       createInfo()    → INotify
// =================================================================

type NotifyType = "success" | "error" | "warning" | "info";

// Contract every notification must fulfill
interface INotify {
  show(message?: string): void;
}

// =================================================================
// ABSTRACT FACTORY INTERFACE
// Defines which products every concrete factory must be able to create.
// Client code depends ONLY on this — never on WebNotifyFactory directly.
// =================================================================
interface INotifyFactory {
  createSuccess(): INotify;
  createError(): INotify;
  createWarning(): INotify;
  createInfo(): INotify;
}

// =================================================================
// PRODUCT FAMILY A — Web (toast-style notifications)
// All classes share the same render style: [TOAST] prefix
// =================================================================
abstract class BaseWebNotify implements INotify {
  constructor(
    private readonly label: string,
    private readonly type: NotifyType
  ) {}

  show(message?: string): void {
    const icons: Record<NotifyType, string> = {
      success: "✓",
      error: "✕",
      warning: "!",
      info: "i",
    };
    // Web-specific output: simulates a toast popup
    console.log(`[TOAST] [${icons[this.type]}] ${this.label}: ${message ?? "—"}`);
  }
}

class WebSuccessNotify extends BaseWebNotify {
  constructor() {
    super("Success", "success");
  }
}
class WebErrorNotify extends BaseWebNotify {
  constructor() {
    super("Error", "error");
  }
}
class WebWarningNotify extends BaseWebNotify {
  constructor() {
    super("Warning", "warning");
  }
}
class WebInfoNotify extends BaseWebNotify {
  constructor() {
    super("Info", "info");
  }
}

// =================================================================
// PRODUCT FAMILY B — Mobile (push-banner style notifications)
// Same interface, different render style: [PUSH] prefix
// =================================================================
abstract class BaseMobileNotify implements INotify {
  constructor(
    private readonly label: string,
    private readonly type: NotifyType
  ) {}

  show(message?: string): void {
    const icons: Record<NotifyType, string> = {
      success: "✓",
      error: "✕",
      warning: "!",
      info: "i",
    };
    // Mobile-specific output: simulates a push notification banner
    console.log(`[PUSH] ${icons[this.type]} ${this.label.toUpperCase()} — ${message ?? "—"}`);
  }
}

class MobileSuccessNotify extends BaseMobileNotify {
  constructor() {
    super("Success", "success");
  }
}
class MobileErrorNotify extends BaseMobileNotify {
  constructor() {
    super("Error", "error");
  }
}
class MobileWarningNotify extends BaseMobileNotify {
  constructor() {
    super("Warning", "warning");
  }
}
class MobileInfoNotify extends BaseMobileNotify {
  constructor() {
    super("Info", "info");
  }
}

// =================================================================
// CONCRETE FACTORY A — produces the entire Web family
// Swap this out for MobileNotifyFactory and every notification
// in the app switches to mobile style — zero other changes needed.
// =================================================================
class WebNotifyFactory implements INotifyFactory {
  createSuccess(): INotify {
    return new WebSuccessNotify();
  }
  createError(): INotify {
    return new WebErrorNotify();
  }
  createWarning(): INotify {
    return new WebWarningNotify();
  }
  createInfo(): INotify {
    return new WebInfoNotify();
  }
}

// =================================================================
// CONCRETE FACTORY B — produces the entire Mobile family
// =================================================================
class MobileNotifyFactory implements INotifyFactory {
  createSuccess(): INotify {
    return new MobileSuccessNotify();
  }
  createError(): INotify {
    return new MobileErrorNotify();
  }
  createWarning(): INotify {
    return new MobileWarningNotify();
  }
  createInfo(): INotify {
    return new MobileInfoNotify();
  }
}

// =================================================================
// CLIENT CODE
// Depends only on INotifyFactory — has no idea whether it's
// working with Web or Mobile. Swap the factory = swap the family.
// =================================================================
function runNotifications(factory: INotifyFactory): void {
  // Factory guarantees all products belong to the same family
  factory.createSuccess().show("Profile saved");
  factory.createError().show("Network timeout");
  factory.createWarning().show("Low disk space");
  factory.createInfo().show("New version available");
}

// --- Usage ---

console.log("=== Web platform ===");
runNotifications(new WebNotifyFactory());
// [TOAST] [✓] Success: Profile saved
// [TOAST] [✕] Error: Network timeout
// [TOAST] [!] Warning: Low disk space
// [TOAST] [i] Info: New version available

console.log("\n=== Mobile platform ===");
runNotifications(new MobileNotifyFactory());
// [PUSH] ✓ SUCCESS — Profile saved
// [PUSH] ✕ ERROR — Network timeout
// [PUSH] ! WARNING — Low disk space
// [PUSH] i INFO — New version available

// The power: one line change switches the ENTIRE notification family
console.log("\n=== Mobile OR Web platform ===");
const platform: INotifyFactory = true ? new WebNotifyFactory() : new MobileNotifyFactory();
runNotifications(platform);
